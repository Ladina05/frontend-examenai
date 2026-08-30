import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: API_BASE,
})

// Toutes les réponses du backend suivent le même enveloppe { success, message, data }.
// On laisse remonter la réponse complète et on extrait "data" au niveau des appels
// pour garder accès à "message" en cas d'erreur.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Une erreur inattendue s'est produite."
    return Promise.reject(new Error(message))
  },
)

export default apiClient
