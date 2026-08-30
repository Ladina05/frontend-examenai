import { useCallback, useEffect, useState } from 'react'
import {
  createQuestion,
  deleteQuestion,
  fetchQuestionsByExam,
  updateQuestion,
} from '../api/questions'

export default function useQuestions(examId) {
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadQuestions = useCallback(async () => {
    if (!examId) {
      setQuestions([])
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchQuestionsByExam(examId)
      setQuestions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [examId])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  function openCreateDialog() {
    setEditingQuestion(null)
    setSubmitError(null)
    setDialogOpen(true)
  }

  function openEditDialog(question) {
    setEditingQuestion(question)
    setSubmitError(null)
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditingQuestion(null)
    setSubmitError(null)
  }

  async function handleSubmit(payload) {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, payload)
      } else {
        await createQuestion(payload)
      }
      closeDialog()
      await loadQuestions()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return

    setIsDeleting(true)
    setError(null)
    try {
      await deleteQuestion(deleteTarget.id)
      setDeleteTarget(null)
      await loadQuestions()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    questions,
    isLoading,
    error,
    setError,
    dialogOpen,
    editingQuestion,
    isSubmitting,
    submitError,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    confirmDelete,
    reloadQuestions: loadQuestions,
  }
}
