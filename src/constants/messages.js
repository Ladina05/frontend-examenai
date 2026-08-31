export const MESSAGES = {
  course: {
    uploaded: (title) => `« ${title} » a été ajouté et ses chapitres ont été extraits.`,
    deleted: 'Cours supprimé avec succès.',
    loadError: 'Impossible de charger les cours.',
    validationFile: 'Choisissez un fichier de cours avant de continuer.',
    validationTitle: 'Donnez un titre à ce cours.',
  },
  exam: {
    generated: (title, count) => `Examen « ${title} » généré — ${count} question(s).`,
    generateError: 'La génération a échoué.',
    formIncomplete: 'Complétez le formulaire avant de lancer la génération.',
  },
  question: {
    created: 'Question ajoutée avec succès.',
    updated: 'Question modifiée avec succès.',
    deleted: 'Question supprimée avec succès.',
    loadError: 'Impossible de charger les questions.',
  },
  export: {
    pdfSuccess: (filename) => `Fichier ${filename} téléchargé.`,
    docxSuccess: (filename) => `Fichier ${filename} téléchargé.`,
    error: 'Le téléchargement a échoué.',
  },
}
