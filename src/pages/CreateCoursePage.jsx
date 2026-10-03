import { useState } from 'react'
import { Link } from 'react-router-dom'
import BrandHeader from '../components/BrandHeader.jsx'
import BottomNavigation from '../components/BottomNavigation.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useCreateCourse } from '../hooks/useCreateCourse.js'
import '../styles/create-course.css'

function CreateCoursePage() {
  const [successMessage, setSuccessMessage] = useState('')
  const { session } = useAuth()
  const createCourseMutation = useCreateCourse()

  async function handleSubmit(event) {
    event.preventDefault()
    setSuccessMessage('')
    createCourseMutation.reset()

    const form = event.currentTarget
    const formData = new FormData(form)
    const courseData = {
      courseName: formData.get('courseName').trim(),
      code: formData.get('code').trim().toUpperCase(),
      totalSemesters: Number(formData.get('totalSemesters')),
    }

    try {
      await createCourseMutation.mutateAsync({
        courseData,
        accessToken: session?.access_token,
      })
      form.reset()
      setSuccessMessage('Course created successfully.')
    } catch {
      // The mutation exposes the server error below.
    }
  }

  return (
    <main className="create-course-page">
      <div className="create-course-content">
        <BrandHeader showAdminLogin={false} />
        <h1 className="create-course-title">Create Course</h1>

        <form className="create-course-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="course-name">Course name</label>
          <input
            autoComplete="off"
            className="create-course-input"
            id="course-name"
            maxLength={100}
            name="courseName"
            placeholder="Course Name"
            required
            type="text"
          />

          <label className="sr-only" htmlFor="course-code">Code</label>
          <input
            autoComplete="off"
            className="create-course-input create-course-code"
            id="course-code"
            maxLength={20}
            name="code"
            placeholder="Code"
            required
            type="text"
          />

          <label className="sr-only" htmlFor="course-semesters">Total semesters</label>
          <input
            className="create-course-input"
            id="course-semesters"
            inputMode="numeric"
            max="20"
            min="1"
            name="totalSemesters"
            placeholder="Total Semester"
            required
            type="number"
          />

          <button className="create-course-submit" disabled={createCourseMutation.isPending} type="submit">
            {createCourseMutation.isPending ? 'Creating…' : 'Create'}
          </button>

          {createCourseMutation.error && (
            <p className="create-course-feedback is-error" role="alert">
              {createCourseMutation.error.message}
            </p>
          )}
          {successMessage && (
            <p className="create-course-feedback is-success" role="status">
              {successMessage}
            </p>
          )}
        </form>
        <Link className="create-course-back" to="/admin/dashboard">Back to dashboard</Link>
      </div>
      <BottomNavigation />
    </main>
  )
}

export default CreateCoursePage