export const MESSAGES = {
  course: {
    uploaded: (title) => `« ${title} » a été ajouté et ses chapitres ont été extraits.`,
    deleted: 'Cours supprimé avec succès.',
    loadError: 'Impossible de charger les cours.',
    validationFile: 'Choisissez un fichier de cours avant de continuer.',
    validationTitle: 'Donnez un titre à ce cours.',
  },
  exam: {
    generated: (title, count) =>
      `Examen « ${title} » prêt — ${count} question(s). Vous pouvez les éditer ou l’exporter.`,
    generateError: 'La génération a échoué. Réessayez dans quelques instants.',
    formIncomplete: 'Complétez le formulaire avant de lancer la génération.',
    deleted: 'Examen supprimé avec succès.',
    deleteError: "Impossible de supprimer cet examen. Réessayez.",
    deleteConfirm: (title) =>
      `« ${title} » et toutes ses questions seront définitivement supprimés.`,
  },
  question: {
    created: 'Question ajoutée avec succès.',
    updated: 'Question modifiée avec succès.',
    deleted: 'Question supprimée avec succès.',
    loadError: 'Impossible de charger les questions.',
  },
  export: {
    pdfSuccess: (filename) => `PDF « ${filename} » téléchargé — prêt à imprimer.`,
    docxSuccess: (filename) => `Word « ${filename} » téléchargé — ouvrez-le pour le modifier.`,
    error: 'Le téléchargement a échoué. Réessayez.',
  },
  network: {
    unreachable:
      "Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez (le backend peut être en veille).",
  },
}
