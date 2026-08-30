# ExamGenAI — Frontend

Interface React (Vite + Tailwind) pour le générateur d'examens par chapitre.

## Lancer le projet

```bash
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173` et attend le backend Spring Boot sur
`http://localhost:8080/api` (voir `src/api/client.js` pour changer l'URL).

## État d'avancement

Seules les **Pages 1 et 2** du plan sont implémentées pour l'instant :

- **Page 1 — `/courses`** : upload d'un cours (fichier + titre + description),
  liste des cours, suppression.
- **Page 2 — `/courses/:id`** : détail d'un cours, table des matières des chapitres,
  visionneuse de contenu d'un chapitre.

Les pages 3 (génération IA), 4 (édition des questions) et 5 (export) ne sont pas
encore développées — elles apparaissent en grisé dans la barre latérale, marquées
« bientôt ».

## Structure

```
src/
├── api/            # client axios + appels par domaine (courses, chapters)
├── components/     # briques UI réutilisables
├── layouts/         # ossature de page (sidebar + zone de contenu)
└── pages/          # CoursesPage, CourseDetailPage
```
