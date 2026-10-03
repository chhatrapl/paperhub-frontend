import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowUpRight, RefreshCw, Trash2 } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import BrandHeader from '../components/BrandHeader.jsx'
import BottomNavigation from '../components/BottomNavigation.jsx'
import {
  deleteQuestionPaper,
  fetchQuestionPapers,
  verifyQuestionPaperAdmin,
} from '../api/questionPapersApi.js'
import { useAuth } from '../hooks/useAuth.js'
import { useCourses } from '../hooks/useCourses.js'
import '../styles/select-semester.css'

const semesterOrdinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

function SelectSemesterPage() {
  const { courseCode = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { session } = useAuth()
  const queryClient = useQueryClient()
  const selectedSemesterParam = searchParams.get('semester')
  const selectedSemester = Number(selectedSemesterParam)
  const { courses } = useCourses()
  const normalizedCourseCode = courseCode.toUpperCase()
  const course = courses.find((item) => item.code.toUpperCase() === normalizedCourseCode)
  const semesterCount = Math.min(Math.max(Number(course?.totalSemesters) || 8, 1), 8)
  const isValidSemester = Number.isInteger(selectedSemester)
    && selectedSemester >= 1
    && selectedSemester <= semesterCount
  const papersQueryKey = ['question-papers', normalizedCourseCode, selectedSemester]
  const papersQuery = useQuery({
    queryKey: papersQueryKey,
    queryFn: () => fetchQuestionPapers(normalizedCourseCode, selectedSemester),
    enabled: Boolean(normalizedCourseCode) && isValidSemester,
  })
  const sortedPapers = [...(papersQuery.data ?? [])].sort((paperA, paperB) => (
    Number(paperB.year) - Number(paperA.year)
    || paperA.title.localeCompare(paperB.title)
  ))
  const adminAccessQuery = useQuery({
    queryKey: ['question-paper-admin-access', session?.user?.id],
    queryFn: () => verifyQuestionPaperAdmin(session.access_token),
    enabled: Boolean(session?.access_token),
    retry: false,
  })
  const deleteMutation = useMutation({
    mutationFn: (questionPaperId) => (
      deleteQuestionPaper(questionPaperId, session?.access_token)
    ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: papersQueryKey }),
  })

  function handleSemesterSelect(semester) {
    setSearchParams({ semester: String(semester) })
  }

  function handleDeleteQuestionPaper(paper) {
    if (window.confirm(`Delete "${paper.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(paper._id)
    }
  }

  return (
    <main className="select-semester-page">
      <div className="select-semester-content">
        <BrandHeader showAdminLogin={false} />
        <div className="semester-heading-row">
          <Link className="semester-back-link" to="/" aria-label="Back to courses">
            <ArrowLeft aria-hidden="true" />
          </Link>
          <div className="semester-heading-copy">
            <h1>{course?.courseName || normalizedCourseCode}</h1>
            <p>{normalizedCourseCode}</p>
          </div>
        </div>

        <section className="semester-panel" aria-label="Select a semester">
          <h2>Choose Semester</h2>
          <div className="semester-list">
            {semesterOrdinals.slice(0, semesterCount).map((ordinal, index) => {
              const semester = index + 1
              const isSelected = selectedSemester === semester && isValidSemester

              return (
                <button
                  aria-pressed={isSelected}
                  className={`semester-option${isSelected ? ' is-selected' : ''}`}
                  key={semester}
                  onClick={() => handleSemesterSelect(semester)}
                  type="button"
                >
                  <span className="semester-option-number">{String(semester).padStart(2, '0')}</span>
                  <span className="semester-option-title">{ordinal} Semester</span>
                  <ArrowUpRight aria-hidden="true" className="semester-option-arrow" />
                </button>
              )
            })}
          </div>
        </section>

        {isValidSemester && (
          <section className="papers-section" aria-live="polite">
            <div className="papers-heading">
              <h2>{semesterOrdinals[selectedSemester - 1]} Semester Papers</h2>
              {papersQuery.isSuccess && (
                <span className="papers-count">{papersQuery.data.length}</span>
              )}
            </div>

            {deleteMutation.isError && (
              <p className="paper-delete-error" role="alert">{deleteMutation.error.message}</p>
            )}

            {papersQuery.isPending && (
              <div className="papers-state" aria-busy="true">Loading papers…</div>
            )}

            {papersQuery.isError && (
              <div className="papers-state papers-state-error" role="alert">
                <p>{papersQuery.error.message}</p>
                <button className="papers-retry" onClick={() => papersQuery.refetch()} type="button">
                  <RefreshCw aria-hidden="true" size={16} />
                  Retry
                </button>
              </div>
            )}

            {papersQuery.isSuccess && papersQuery.data.length === 0 && (
              <div className="papers-state">No question papers for this semester yet.</div>
            )}

            {papersQuery.isSuccess && sortedPapers.length > 0 && (
              <div className="paper-list">
                {sortedPapers.map((paper) => (
                  <article className="paper-row" key={paper._id}>
                    <a
                      className="paper-row-open"
                      href={paper.pdfDetails?.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="paper-copy">
                        <span className="paper-title">{paper.title}</span>
                        <span className="paper-meta">
                          <span>{paper.subjectCode}</span>
                          <span aria-hidden="true">·</span>
                          <span>{paper.year}</span>
                        </span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="paper-open-icon" />
                    </a>
                    {adminAccessQuery.data === true && paper.storagePath && (
                      <button
                        aria-label={`Delete ${paper.title}`}
                        className="paper-delete"
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDeleteQuestionPaper(paper)}
                        title="Delete question paper"
                        type="button"
                      >
                        <Trash2 aria-hidden="true" size={18} />
                      </button>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
      <BottomNavigation />
    </main>
  )
}

export default SelectSemesterPage