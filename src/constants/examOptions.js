export const QUESTION_TYPES = [
  {
    id: 'QCM',
    label: 'QCM',
    hint: 'Plusieurs propositions, une seule bonne réponse.',
  },
  {
    id: 'TRUE_FALSE',
    label: 'Vrai / Faux',
    hint: 'Affirmation à valider ou invalider.',
  },
  {
    id: 'OPEN',
    label: 'Question ouverte',
    hint: 'Réponse libre rédigée par l’étudiant.',
  },
  {
    id: 'FILL_IN_BLANK',
    label: 'Texte à trous',
    hint: 'Phrase avec un ou plusieurs blancs à compléter.',
  },
]

export const DIFFICULTIES = [
  {
    id: 'EASY',
    label: 'Facile',
    hint: 'Questions directes, peu de raisonnement.',
  },
  {
    id: 'MEDIUM',
    label: 'Moyen',
    hint: 'Compréhension et application du cours.',
  },
  {
    id: 'HARD',
    label: 'Difficile',
    hint: 'Analyse, synthèse ou cas plus complexes.',
  },
]
