import { useQuery } from '@tanstack/react-query'
import { fetchCourses } from '../api/courseApi.js'

export function useCourses() {
  const query = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  return {
    courses: query.data ?? [],
    error: query.error,
    isError: query.isError,
    isPending: query.isPending,
    refetch: query.refetch,
  }
}