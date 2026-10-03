import { useMutation } from '@tanstack/react-query'
import { createCourse } from '../api/courseApi.js'

export function useCreateCourse() {
  return useMutation({
    mutationFn: ({ courseData, accessToken }) => createCourse(courseData, accessToken),
  })
}