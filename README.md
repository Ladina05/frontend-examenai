# ExamGenAI — Frontend

Interface React (Vite + Tailwind) du générateur d'examens par chapitre.

Backend : http://localhost:8080
Frontend : http://localhost:5173

- Backend : https://github.com/Herihasina21/backend-examgenai
- Frontend : https://github.com/Ladina05/frontend-examenai

Projet GLA — Master 1, 2026.

Le détail des pages et des tâches est dans [PLAN_FRONT.md](./PLAN_FRONT.md).

## Équipe

| Membre | Frontend | Branche suggérée |
|--------|----------|------------------|
| Ladina | Pages Upload, Cours, Chapitres | `feat/courses-chapters` |
| Herihasina | Page Génération IA | `feat/generate-exam-page` |
| Tsiory | Pages Édition questions + Export | `feat/questions-export` |

## Pipeline

```
Upload → Chapitres → Génération IA → Édition → Export
```

## Lancer le projet

Prérequis : Node 18+, backend Spring Boot démarré sur le port 8080.

```bash
git clone git@github.com:Ladina05/frontend-examenai.git
cd frontend-examenai
npm install
npm run dev
```

L'application démarre sur http://localhost:5173.

L'URL de l'API se configure via `VITE_API_URL` (voir `.env.example`).
Par défaut en local : `http://localhost:8080/api`.

## Déploiement Vercel

1. Pousser la branche `chore/vercel-deploy` (ou merger sur `main`).
2. Sur [vercel.com](https://vercel.com) : importer le repo `frontend-examenai`.
3. Réglages :
   - Framework : **Vite**
   - Build Command : `npm run build`
   - Output Directory : `dist`
4. Environment Variable :
   - `VITE_API_URL` = `https://backend-examgenai.onrender.com/api`
5. Deploy.
6. Sur Render (backend), mettre à jour CORS :
   - `APP_CORS_ALLOWED_ORIGINS` = `https://VOTRE-APP.vercel.app,http://localhost:5173`
   puis redeployer / redémarrer le service.

Fichier utile : `vercel.json` (routes SPA React Router).

## État actuel

| Page | Route | Statut |
|------|-------|--------|
| Accueil | `/` | Fait |
| Liste + upload cours | `/courses` | Fait |
| Détail cours / chapitres | `/courses/:id` | Fait |
| Génération IA | `/generation` | Fait |
| Édition questions | `/questions` | Fait |
| Export | `/export` | Fait |

## Git

Ne pas pusher directement sur `main`.

```bash
git checkout main
git pull origin main
git checkout -b feat/nom-de-la-page
git add .
git commit -m "feat: description courte"
git push -u origin feat/nom-de-la-page
```

Puis Pull Request vers `main`.

Conventions de commit : `feat:`, `fix:`, `chore:`.

## Structure

```
src/
├── api/            # client axios + appels par domaine (courses, chapters, exams)
├── components/     # briques UI réutilisables
├── context/
├── layouts/
└── pages/
```

## Licence

Projet académique — Master 1 GLA 2026.
