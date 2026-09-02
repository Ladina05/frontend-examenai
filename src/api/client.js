import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: API_BASE,
})

// Toutes les réponses JSON du backend suivent l'enveloppe { success, message, data }.
// L'export PDF/Word renvoie en revanche un fichier binaire (responseType: 'blob') :
// dans ce cas, même le corps d'erreur arrive sous forme de Blob et doit être lu
// de façon asynchrone avant de pouvoir en extraire le message.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    let message = error.message || "Une erreur inattendue s'est produite."

    const data = error.response?.data

    if (data instanceof Blob) {
      try {
        const text = await data.text()
        const parsed = JSON.parse(text)
        message = parsed.message || parsed.error || message
      } catch {
        // Le corps du blob n'était pas du JSON exploitable : on garde le message par défaut.
      }
    } else if (data?.message) {
      message = data.message
    }

    return Promise.reject(new Error(message))
  },
)

export default apiClient