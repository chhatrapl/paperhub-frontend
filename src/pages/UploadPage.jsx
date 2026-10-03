import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileUp } from 'lucide-react'
import BrandHeader from '../components/BrandHeader.jsx'
import BottomNavigation from '../components/BottomNavigation.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useUploadQuestionPaper } from '../hooks/useUploadQuestionPaper.js'
import '../styles/upload-page.css'

function UploadPage() {
  const [fileName, setFileName] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { session } = useAuth()
  const uploadMutation = useUploadQuestionPaper()

  async function handleSubmit(event) {
    event.preventDefault()
    setSuccessMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const pdf = formData.get('pdf')

    if (!(pdf instanceof File) || pdf.size === 0) {
      uploadMutation.reset()
      return
    }

    if (!pdf.name.toLowerCase().endsWith('.pdf')) {
      uploadMutation.reset()
      return
    }

    try {
      const uploadedPaper = await uploadMutation.mutateAsync({
        formData,
        accessToken: session?.access_token,
      })
      form.reset()
      setFileName('')
      setSuccessMessage(uploadedPaper?.title
        ? `${uploadedPaper.title} uploaded successfully.`
        : 'Question paper uploaded successfully.')
    } catch {
      // The mutation exposes the server error below.
    }
  }

  function handleFileChange(event) {
    setFileName(event.currentTarget.files?.[0]?.name ?? '')
    setSuccessMessage('')
    uploadMutation.reset()
  }

  const errorMessage = uploadMutation.error?.message
    || (!fileName && uploadMutation.isError ? 'Select a PDF file to upload.' : '')

  return (
    <main className="upload-page">
      <div className="upload-content">
        <BrandHeader showAdminLogin={false} />
        <div className="upload-heading-row">
          <Link className="upload-back-link" to="/admin/dashboard" aria-label="Back to dashboard">
            <span aria-hidden="true">‹</span>
          </Link>
          <h1 className="upload-title">Upload Question Paper</h1>
        </div>

        <form className="upload-form-panel" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="paper-title">Title</label>
          <input
            className="upload-input"
            id="paper-title"
            name="title"
            placeholder="Title"
            required
            type="text"
          />

          <label className="sr-only" htmlFor="paper-subject-code">Subject code</label>
          <input
            className="upload-input"
            id="paper-subject-code"
            name="subjectCode"
            placeholder="Subject Code"
            required
            type="text"
          />

          <label className="sr-only" htmlFor="paper-course-code">Course code</label>
          <input
            className="upload-input"
            id="paper-course-code"
            name="courseCode"
            placeholder="Course Code"
            required
            type="text"
          />

          <label className="sr-only" htmlFor="paper-semester">Semester</label>
          <input
            className="upload-input"
            id="paper-semester"
            inputMode="numeric"
            max="8"
            min="1"
            name="semester"
            placeholder="Semester"
            required
            type="number"
          />

          <label className="sr-only" htmlFor="paper-year">Year</label>
          <input
            className="upload-input"
            id="paper-year"
            inputMode="numeric"
            max="2100"
            min="1900"
            name="year"
            placeholder="Year"
            required
            type="number"
          />

          <div className="upload-file-control">
            <input
              accept="application/pdf,.pdf"
              className="upload-file-input"
              id="paper-pdf"
              name="pdf"
              onChange={handleFileChange}
              required
              type="file"
            />
            <label className="upload-file-label" htmlFor="paper-pdf">
              <FileUp aria-hidden="true" className="upload-file-icon" strokeWidth={1.8} />
              <span className="upload-file-copy">
                <span className="upload-file-title">{fileName || 'Upload PDF'}</span>
                <span className="upload-file-hint">{fileName ? 'Choose another PDF' : 'Choose PDF file'}</span>
              </span>
            </label>
          </div>

          <button className="upload-submit" disabled={uploadMutation.isPending} type="submit">
            {uploadMutation.isPending ? 'Uploading…' : 'Upload'}
          </button>

          {errorMessage && <p className="upload-feedback is-error" role="alert">{errorMessage}</p>}
          {successMessage && <p className="upload-feedback is-success" role="status">{successMessage}</p>}
        </form>
      </div>
      <BottomNavigation />
    </main>
  )
}

export default UploadPage