import apiClient from './client'

export async function fetchCourses() {
  const { data } = await apiClient.get('/courses')
  return data.data
}

export async function fetchCourseById(id) {
  const { data } = await apiClient.get(`/courses/${id}`)
  return data.data
}

export async function uploadCourse({ file, title, description }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', title)
  if (description) {
    formData.append('description', description)
  }

  const { data } = await apiClient.post('/courses/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function deleteCourse(id) {
  await apiClient.delete(`/courses/${id}`)
}
