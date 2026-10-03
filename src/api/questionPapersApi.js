import { apiUrl } from './apiBase.js'

export async function fetchQuestionPapers(courseCode, semester) {
  const response = await fetch(
    apiUrl(`/api/v1/questionPaper/course/${encodeURIComponent(courseCode)}/semester/${semester}`),
  )
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || 'Unable to load question papers right now.')
  }

  if (!Array.isArray(result?.data)) {
    throw new Error('The question paper response was not in the expected format.')
  }

  return result.data
}

export async function verifyQuestionPaperAdmin(accessToken) {
  const response = await fetch(apiUrl('/api/v1/questionPaper/admin/check'), {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (response.status === 401 || response.status === 403) {
    return false
  }

  if (!response.ok) {
    throw new Error('Unable to verify admin access right now.')
  }

  return true
}

export async function deleteQuestionPaper(questionPaperId, accessToken) {
  const response = await fetch(apiUrl(`/api/v1/questionPaper/${encodeURIComponent(questionPaperId)}`), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || 'Unable to delete the question paper.')
  }

  return result
}

export async function uploadQuestionPaper(formData, accessToken) {
  const headers = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {}
  const response = await fetch(apiUrl('/api/v1/questionPaper/upload'), {
    method: 'POST',
    headers,
    body: formData,
  })
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || 'Question paper upload failed.')
  }

  return result.data
}