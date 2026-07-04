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
