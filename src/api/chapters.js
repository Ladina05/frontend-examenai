import apiClient from './client'

export async function fetchChaptersByCourse(courseId) {
  const { data } = await apiClient.get(`/chapters/course/${courseId}`)
  return data.data
}

export async function fetchChapterById(id) {
  const { data } = await apiClient.get(`/chapters/${id}`)
  return data.data
}
