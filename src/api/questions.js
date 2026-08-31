import apiClient from './client'

export async function fetchQuestionsByExam(examId) {
  const { data } = await apiClient.get(`/questions/exam/${examId}`)
  return data.data
}

export async function fetchQuestionById(id) {
  const { data } = await apiClient.get(`/questions/${id}`)
  return data.data
}

export async function createQuestion(payload) {
  const { data } = await apiClient.post('/questions', payload)
  return data.data
}

export async function updateQuestion(id, payload) {
  const { data } = await apiClient.put(`/questions/${id}`, payload)
  return data.data
}

export async function deleteQuestion(id) {
  const { data } = await apiClient.delete(`/questions/${id}`)
  return data
}
