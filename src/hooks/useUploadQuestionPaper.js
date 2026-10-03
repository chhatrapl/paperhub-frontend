import { useMutation } from '@tanstack/react-query'
import { uploadQuestionPaper } from '../api/questionPapersApi.js'

export function useUploadQuestionPaper() {
  return useMutation({
    mutationFn: ({ formData, accessToken }) => (
      uploadQuestionPaper(formData, accessToken)
    ),
  })
}