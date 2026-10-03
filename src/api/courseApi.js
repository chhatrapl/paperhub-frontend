import { apiUrl } from './apiBase.js'

export async function fetchCourses() {
  const response = await fetch(apiUrl('/api/v1/course'))
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || 'Unable to load courses right now.')
  }

  if (!Array.isArray(result?.data)) {
    throw new Error('The course list response was not in the expected format.')
  }

  return result.data
}

export async function createCourse(courseData, accessToken) {
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }
  const response = await fetch(apiUrl('/api/v1/course/createCourse'), {
    method: 'POST',
    headers,
    body: JSON.stringify(courseData),
  })
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || 'Unable to create the course right now.')
  }

  return result.data
}