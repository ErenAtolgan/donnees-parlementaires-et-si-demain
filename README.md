# Données parlementaires : et si demain ?

Dépôt du défi **Données parlementaires : et si demain ?** du Hackathon 2026 de l'Assemblée nationale.

Atelier de design fiction sur les futurs possibles des données ouvertes du Parlement, illustré par un prototype d'indicateur d'efficacité du débat démocratique.

- Page du défi : https://hackathon2026.assemblee-nationale.fr/defis/8cd2f78c-94bd-457f-bb3c-5a4fa29acfa5
- Contenu de la page du défi : [`hackathon-an-2026/DEFI.md`](hackathon-an-2026/DEFI.md)

## Prototype

Application web (React + Vite) présentant l'indicateur « Efficacité du débat démocratique ».

### Démarrer en local

```
cd app
npm install
npm run dev
```

Puis ouvrir l'URL affichée par Vite.

### Scripts

- `npm run dev` : serveur de développement
- `npm run build` : build de production
- `npm run preview` : prévisualisation du build
- `npm run lint` : analyse Oxlint

### Déploiement (CI/CD)

Le workflow GitHub Actions [`deploy-alwaysdata.yml`](.github/workflows/deploy-alwaysdata.yml) :

- **CI** : lint (Oxlint) et build de production sur chaque pull request et push sur `main` ;
- **CD** : à chaque push sur `main` (ou déclenchement manuel), déploie le contenu de `app/dist/` sur AlwaysData via `rsync` en SSH. AlwaysData est la seule cible de déploiement.

La cible AlwaysData est configurée directement dans le workflow (bloc `env`) :

- hôte SSH : `ssh-openlaw.alwaysdata.net`
- utilisateur : `openlaw`
- répertoire déployé : `/home/openlaw/www`

Un seul secret est à configurer dans le dépôt GitHub (*Settings → Secrets and variables → Actions → New repository secret*) :

| Secret | Description |
| --- | --- |
| `ALWAYSDATA_SSH_KEY` | Clé privée SSH dédiée au déploiement ; la clé publique correspondante doit être ajoutée sur le compte AlwaysData (admin AlwaysData → *Accès distant → SSH → clés publiques* de l'utilisateur `openlaw`, ou `~/.ssh/authorized_keys`) |

Pour générer la paire de clés en local :

```
ssh-keygen -t ed25519 -f alwaysdata_deploy -N "" -C "deploy-github-actions"
```

Puis mettre le contenu de `alwaysdata_deploy` (clé privée) dans le secret `ALWAYSDATA_SSH_KEY`, et celui de `alwaysdata_deploy.pub` sur le compte AlwaysData.

## Structure du dépôt

- `app/` : code du prototype (application React + Vite)
  - `src/` : composants (`Gauge`, `Logo`, `App`)
  - `public/` : assets statiques (`favicon.svg`, `logo.png`)
- `hackathon-an-2026/` : dossier lu par la plateforme du hackathon
  - `DEFI.md` : contenu affiché sur la page du défi
  - `docs/` : documents référencés
  - `images/` : visuels référencés

## Équipe

- Porteurs : Sumi Saint-Auguste et Fabien Lechevalier
- Contributeur : Eren Atolgan
