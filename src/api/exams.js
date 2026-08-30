import apiClient from './client'

export async function generateExam(payload) {
  const { data } = await apiClient.post('/exams/generate', payload)
  return data.data
}

export async function fetchExamById(id) {
  const { data } = await apiClient.get(`/exams/${id}`)
  return data.data
}

export async function fetchExamsByChapter(chapterId) {
  const { data } = await apiClient.get(`/exams/chapter/${chapterId}`)
  return data.data
}

export async function deleteExam(id) {
  const { data } = await apiClient.delete(`/exams/${id}`)
  return data
}
