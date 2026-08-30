# Plan frontend — ExamGenAI

**Équipe :** Ladina · Herihasina · Tsiory

| Membre | Frontend |
|--------|----------|
| **Ladina** | Upload, liste des cours, détail chapitres |
| **Herihasina** | Génération d'examen par IA |
| **Tsiory** | Édition des questions, export PDF/Word |

**Stack :** React 18, Vite, Tailwind, Axios, React Router
**API :** `http://localhost:8080/api`
**Repo :** https://github.com/Ladina05/frontend-examenai

Les réponses cours / chapitres / examens suivent `{ success, message, data }`.
Les endpoints questions (`/api/questions`) et export (`/api/export`) ne suivent pas cette enveloppe.

---

## Pipeline UI

```
[1] Upload / liste cours  →  [2] Chapitres  →  [3] Génération IA  →  [4] Édition  →  [5] Export
```

---

## Page 1 — Cours (Ladina)

**Routes :** `/`, `/courses`
**Fichiers :** `CoursesPage.jsx`, `api/courses.js`, `FileDropZone.jsx`

| Fonctionnalité | API |
|----------------|-----|
| Upload fichier + titre + description | `POST /api/courses/upload` (multipart) |
| Liste des cours | `GET /api/courses` |
| Supprimer un cours | `DELETE /api/courses/{id}` |

**Statut :** Fait.

**Reste :**

- [ ] Vérifier les erreurs réseau (backend éteint)
- [ ] Relier chaque carte cours vers `/courses/:id`

**Branche :** `feat/courses-chapters`

---

## Page 2 — Détail cours et chapitres (Ladina)

**Route :** `/courses/:id`
**Fichiers :** `CourseDetailPage.jsx` (aujourd'hui vide), `api/chapters.js`

| Fonctionnalité | API |
|----------------|-----|
| Infos du cours | `GET /api/courses/{id}` |
| Liste des chapitres | `GET /api/chapters/course/{courseId}` |
| Contenu d'un chapitre | `GET /api/chapters/{id}` |

**Statut :** Fait (détail cours + chapitres + bouton vers génération).

**Reste :**

- [x] Afficher titre, type de fichier, description
- [x] Liste des chapitres (titre, numéro)
- [x] Clic chapitre → afficher `content`
- [x] Bouton « Générer un examen » → `/generation?chapterId=...&courseId=...`
- [ ] Message dédié si `content` vide

**Branche :** `feat/courses-chapters`

---

## Page 3 — Génération IA (Herihasina)

**Route :** `/generation` (query `chapterId` / `courseId`)
**Fichiers à créer :** `GenerationPage.jsx` (remplacer le placeholder), `api/exams.js`

| Fonctionnalité | API |
|----------------|-----|
| Chapitre sélectionné | `GET /api/chapters/{id}` |
| Générer | `POST /api/exams/generate` |
| Relire l'examen | `GET /api/exams/{id}` |

**Body JSON :**

```json
{
  "examTitle": "Examen Git",
  "examDescription": "Contrôle",
  "chapterId": 1,
  "numberOfQuestions": 5,
  "durationMinutes": 30,
  "difficultyLevel": "MEDIUM",
  "questionTypes": ["QCM", "TRUE_FALSE", "OPEN"]
}
```

Types autorisés : `QCM`, `TRUE_FALSE`, `OPEN`, `FILL_IN_BLANK`.
Difficulté : `EASY`, `MEDIUM`, `HARD`.

**Tâches :**

- [x] `src/api/exams.js` : `generateExam`, `fetchExamById`, `fetchExamsByChapter`
- [x] Formulaire : titre, description, nb questions, durée, difficulté, types (checkboxes)
- [x] Loader pendant l'appel (souvent 20–40 s)
- [x] Afficher les questions : `statement`, `questionType`, `options`, `correctAnswer`
- [x] Gérer les erreurs (chapitre vide, Gemini, 500)
- [x] Boutons vers édition (`/questions?examId=`) et export (`/export?examId=`)

**Branche :** `feat/generate-exam-page`

---

## Page 4 — Édition des questions (Tsiory)

**Route :** `/questions?examId=`
**Fichiers :** `QuestionsPage.jsx`, `api/questions.js`

Les réponses ne sont **pas** dans `{ data }` : Axios renvoie le JSON brut.

| Fonctionnalité | API |
|----------------|-----|
| Liste | `GET /api/questions/exam/{examId}` |
| Détail | `GET /api/questions/{id}` |
| Ajouter | `POST /api/questions` |
| Modifier | `PUT /api/questions/{id}` |
| Supprimer | `DELETE /api/questions/{id}` → 204 |

**POST body :**

```json
{
  "statement": "...",
  "questionType": "QCM",
  "difficulty": "EASY",
  "points": 2,
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "explanation": "...",
  "examId": 4
}
```

**Tâches :**

- [ ] Choisir un examen (`examId` en query)
- [ ] Carte par question (éditer texte, points, bonne réponse)
- [ ] Formulaire « Ajouter une question »
- [ ] Confirmation avant suppression
- [ ] QCM : au moins 2 options

**Branche :** `feat/question-edit`

---

## Page 5 — Export (Tsiory)

**Route :** `/export?examId=`
**Fichiers :** `ExportPage.jsx`, `api/export.js`

Réponse = **fichier binaire**, pas du JSON. Utiliser `responseType: 'blob'`.

| Fonctionnalité | API |
|----------------|-----|
| PDF | `GET /api/export/pdf/{examId}` |
| Word | `GET /api/export/docx/{examId}` |

**Tâches :**

- [ ] Choisir un examen
- [ ] Boutons Télécharger PDF / Word
- [ ] Nom de fichier `exam-{id}.pdf` / `.docx`
- [ ] Message d'erreur si 500

**Branche :** `feat/export-page`

---

## Fichiers API

```
src/api/
├── client.js      Fait
├── courses.js     Fait
├── chapters.js    Fait
├── exams.js       Fait (Herihasina)
├── questions.js   À faire (Tsiory)
└── export.js      À faire (Tsiory)
```

---

## Ordre de dépendances

```
Ladina : finir CourseDetailPage
    ↓
Herihasina : GenerationPage (besoin d'un chapterId)
    ↓
Tsiory : QuestionsPage + ExportPage (besoin d'un examId)
```

Travail en parallèle possible dès qu'un `chapterId` / `examId` existe (Bruno ou données de test).

---

## Conventions

- Réutiliser `StatusBanner`, `Spinner`, `EmptyState`, `ConfirmDialog`
- Types de questions : `QCM`, `TRUE_FALSE`, `OPEN`, `FILL_IN_BLANK`
- Difficulté : `EASY`, `MEDIUM`, `HARD`
- Commits : `feat:`, `fix:`, `chore:`
- Merge via Pull Request vers `main`

### Branches

```
main
├── feat/courses-chapters      ← Ladina
├── feat/generate-exam-page    ← Herihasina
└── feat/questions-export      ← Tsiory
```

---

## Checklist

- [x] Page 2 détail chapitres
- [x] Page 3 génération IA
- [ ] Page 4 CRUD questions
- [ ] Page 5 export PDF/Word
- [ ] Navigation chapitre → génération → édition → export
- [ ] Backend + front testés ensemble (ports 8080 et 5173)

*Dernière mise à jour : août 2026*
