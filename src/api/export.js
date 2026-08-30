import apiClient from './client'

async function downloadExamFile(examId, format) {
  const extension = format === 'pdf' ? 'pdf' : 'docx'
  try {
    const { data } = await apiClient.get(`/export/${format}/${examId}`, {
      responseType: 'blob',
    })
    return { blob: data, filename: `exam-${examId}.${extension}` }
  } catch (error) {
    const blob = error.response?.data
    if (blob instanceof Blob) {
      const text = await blob.text()
      try {
        const json = JSON.parse(text)
        if (json.message) {
          throw new Error(json.message)
        }
      } catch (parseError) {
        if (parseError instanceof Error && parseError.message !== text) {
          throw parseError
        }
      }
    }
    throw error
  }
}

export function triggerFileDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function downloadExamPdf(examId) {
  return downloadExamFile(examId, 'pdf')
}

export async function downloadExamDocx(examId) {
  return downloadExamFile(examId, 'docx')
}
