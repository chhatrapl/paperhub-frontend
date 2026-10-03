import { useNavigate } from 'react-router-dom'
import BrandHeader from '../components/BrandHeader.jsx'
import BottomNavigation from '../components/BottomNavigation.jsx'
import CourseCard from '../components/CourseCard.jsx'
import { useCourses } from '../hooks/useCourses.js'
import '../styles/home.css'

function HomePage() {
  const navigate = useNavigate()
  const {
    courses,
    error,
    isError,
    isPending,
    refetch,
  } = useCourses()

  const loadState = isPending
    ? 'loading'
    : isError
      ? 'error'
      : courses.length === 0
        ? 'empty'
        : 'success'

  function handleCourseSelect(course) {
    navigate(`/courses/${encodeURIComponent(course.code)}/semesters`)
  }

  return (
    <main className="app-shell">
      <BrandHeader showAdminLogin={false} />

      <section className="course-section" aria-label="Available courses">
        {loadState === 'loading' && (
          <div className="course-list" aria-label="Loading courses" aria-busy="true">
            {Array.from({ length: 5 }, (_, index) => (
              <div className="course-skeleton" key={index}>
                <span className="skeleton-copy">
                  <span />
                  <span />
                </span>
                <span className="skeleton-chevron" />
              </div>
            ))}
          </div>
        )}

        {loadState === 'error' && (
          <div className="state-panel" role="alert">
            <span className="state-mark state-mark-error">!</span>
            <h1>Courses couldn&apos;t load</h1>
            <p>{error.message || 'Check your connection and try again.'}</p>
            <button
              className="retry-button"
              type="button"
              onClick={() => refetch()}
            >
              Try again
            </button>
          </div>
        )}

        {loadState === 'empty' && (
          <div className="state-panel">
            <span className="state-mark">
              <span aria-hidden="true">+</span>
            </span>
            <h1>No courses yet</h1>
            <p>Courses will appear here once they have been added.</p>
          </div>
        )}

        {loadState === 'success' && (
          <div className="course-list">
            {courses.map((course) => (
              <CourseCard
                course={course}
                key={course._id || course.code}
                onSelect={handleCourseSelect}
              />
            ))}
          </div>
        )}
      </section>
      <BottomNavigation />
    </main>
  )
}

export default HomePage