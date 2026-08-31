import { useCallback, useEffect, useState } from 'react'
import {
  createQuestion,
  deleteQuestion,
  fetchQuestionsByExam,
  updateQuestion,
} from '../api/questions'
import { useToast } from '../context/ToastContext'
import { MESSAGES } from '../constants/messages'

export default function useQuestions(examId) {
  var toast = useToast()

  var [questions, setQuestions] = useState([])
  var [isLoading, setIsLoading] = useState(false)
  var [error, setError] = useState(null)

  var [dialogOpen, setDialogOpen] = useState(false)
  var [editingQuestion, setEditingQuestion] = useState(null)
  var [isSubmitting, setIsSubmitting] = useState(false)
  var [submitError, setSubmitError] = useState(null)

  var [deleteTarget, setDeleteTarget] = useState(null)
  var [isDeleting, setIsDeleting] = useState(false)

  var loadQuestions = useCallback(async function () {
    if (!examId) {
      setQuestions([])
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      var data = await fetchQuestionsByExam(examId)
      setQuestions(data)
    } catch (err) {
      setError(err.message || MESSAGES.question.loadError)
    } finally {
      setIsLoading(false)
    }
  }, [examId])

  useEffect(
    function () {
      loadQuestions()
    },
    [loadQuestions],
  )

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
        toast.success(MESSAGES.question.updated)
      } else {
        await createQuestion(payload)
        toast.success(MESSAGES.question.created)
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
      toast.success(MESSAGES.question.deleted)
      await loadQuestions()
    } catch (err) {
      toast.error(err.message)
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
