import axios from 'axios'

var API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
})

function resolveErrorMessage(error) {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'La requête a pris trop de temps. Réessayez dans quelques instants.'
    }
    return "Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez."
  }

  var data = error.response.data
  if (data && typeof data === 'object' && !(data instanceof Blob) && data.message) {
    return data.message
  }

  var status = error.response.status
  if (status === 502 || status === 503 || status === 504) {
    return 'Le serveur est temporairement indisponible. Réessayez dans quelques instants.'
  }
  if (status >= 500) {
    return "Une erreur serveur s'est produite. Réessayez plus tard."
  }

  return error.message || "Une erreur inattendue s'est produite."
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    var message = resolveErrorMessage(error)
    var data = error.response?.data

    if (data instanceof Blob) {
      try {
        var text = await data.text()
        var parsed = JSON.parse(text)
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
