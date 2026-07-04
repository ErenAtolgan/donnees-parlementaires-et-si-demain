<#
.SYNOPSIS
    Configure les secrets et variables GitHub Actions du déploiement AlwaysData.

.DESCRIPTION
    À lancer en local sous PowerShell (Windows 10+ : ssh et ssh-keygen sont inclus).
    Prérequis : la CLI GitHub `gh` (winget install GitHub.cli).

    Le script :
      1. vérifie que gh est installée et authentifiée ;
      2. crée le secret ALWAYSDATA_SSH_KEY (clé existante ou générée pour toi) ;
      3. propose d'autoriser la clé publique sur AlwaysData (authorized_keys) ;
      4. teste la connexion SSH par clé ;
      5. permet d'ajouter d'autres secrets ou variables à la demande.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts/setup-alwaysdata.ps1
#>

$ErrorActionPreference = "Stop"

$Repo    = "ErenAtolgan/donnees-parlementaires-et-si-demain"
$SshUser = "openlaw"
$SshHost = "ssh-openlaw.alwaysdata.net"

Write-Host "=== Configuration du déploiement AlwaysData ===" -ForegroundColor Cyan

# --- 1. CLI GitHub ---
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "La CLI GitHub 'gh' est introuvable." -ForegroundColor Red
    Write-Host "Installe-la puis relance ce script :  winget install GitHub.cli"
    exit 1
}
gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Connexion à GitHub requise..." -ForegroundColor Yellow
    gh auth login
    if ($LASTEXITCODE -ne 0) { Write-Host "Authentification GitHub échouée." -ForegroundColor Red; exit 1 }
}

$answer = Read-Host "Dépôt GitHub [$Repo]"
if ($answer) { $Repo = $answer }

# --- 2. Clé SSH -> secret ALWAYSDATA_SSH_KEY ---
$keyPath = Read-Host "Chemin de la clé privée SSH à utiliser (vide = en générer une nouvelle)"
if (-not $keyPath) {
    $keyPath = Join-Path $HOME ".ssh\alwaysdata_deploy"
    if (Test-Path $keyPath) {
        Write-Host "Clé déjà présente : $keyPath (réutilisée)" -ForegroundColor Yellow
    } else {
        $sshDir = Join-Path $HOME ".ssh"
        if (-not (Test-Path $sshDir)) { New-Item -ItemType Directory -Path $sshDir | Out-Null }
        ssh-keygen -t ed25519 -f $keyPath -N '""' -C "deploy-github-actions"
        if ($LASTEXITCODE -ne 0) { Write-Host "Échec de ssh-keygen." -ForegroundColor Red; exit 1 }
        Write-Host "Clé générée : $keyPath" -ForegroundColor Green
    }
}
$keyPath = $keyPath.Trim('"')
if (-not (Test-Path $keyPath)) { Write-Host "Fichier introuvable : $keyPath" -ForegroundColor Red; exit 1 }

Get-Content -Raw $keyPath | gh secret set ALWAYSDATA_SSH_KEY --repo $Repo
if ($LASTEXITCODE -ne 0) { Write-Host "Échec de la création du secret ALWAYSDATA_SSH_KEY." -ForegroundColor Red; exit 1 }
Write-Host "Secret ALWAYSDATA_SSH_KEY créé dans $Repo" -ForegroundColor Green

# --- 3. Autorisation de la clé publique sur AlwaysData ---
$pubPath = "$keyPath.pub"
if (Test-Path $pubPath) {
    $answer = Read-Host "Autoriser la clé publique sur AlwaysData maintenant ? Le mot de passe SSH de '$SshUser' sera demandé [O/n]"
    if ($answer -notmatch '^[nN]') {
        Get-Content $pubPath | ssh "$SshUser@$SshHost" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
        if ($LASTEXITCODE -eq 0) { Write-Host "Clé publique ajoutée à authorized_keys." -ForegroundColor Green }
        else { Write-Host "Échec de l'ajout (shell SSH activé pour $SshUser dans l'admin AlwaysData ?)." -ForegroundColor Red }
    }
} else {
    Write-Host "Pas de fichier $pubPath : pense à autoriser la clé publique correspondante sur AlwaysData." -ForegroundColor Yellow
}

# --- 4. Test de connexion par clé ---
$answer = Read-Host "Tester la connexion SSH par clé ? [O/n]"
if ($answer -notmatch '^[nN]') {
    ssh -i $keyPath -o BatchMode=yes -o StrictHostKeyChecking=accept-new "$SshUser@$SshHost" "echo OK"
    if ($LASTEXITCODE -eq 0) { Write-Host "Connexion par clé opérationnelle." -ForegroundColor Green }
    else { Write-Host "La connexion par clé ne fonctionne pas encore." -ForegroundColor Red }
}

# --- 5. Secrets / variables supplémentaires ---
while ($true) {
    $kind = Read-Host "Ajouter autre chose ? [s]ecret / [v]ariable / [ENTRÉE pour terminer]"
    if (-not $kind) { break }
    $name = Read-Host "  Nom"
    if (-not $name) { continue }
    if ($kind -match '^[vV]') {
        $value = Read-Host "  Valeur"
        gh variable set $name --repo $Repo --body $value
        if ($LASTEXITCODE -eq 0) { Write-Host "  Variable $name créée." -ForegroundColor Green }
    } else {
        $secure = Read-Host "  Valeur (saisie masquée)" -AsSecureString
        $value = [System.Net.NetworkCredential]::new("", $secure).Password
        $value | gh secret set $name --repo $Repo
        if ($LASTEXITCODE -eq 0) { Write-Host "  Secret $name créé." -ForegroundColor Green }
    }
}

Write-Host ""
Write-Host "Terminé. Relance le workflow 'CI/CD AlwaysData' (onglet Actions) ou pousse sur main :" -ForegroundColor Cyan
Write-Host "le site sera déployé sur http://openlaw.alwaysdata.net/"
