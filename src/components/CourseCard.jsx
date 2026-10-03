import { ChevronRight } from 'lucide-react'

function CourseCard({ course, onSelect }) {
  const semesterLabel = course.totalSemesters === 1 ? 'semester' : 'semesters'

  return (
    <button
      className="course-card"
      type="button"
      aria-label={`${course.courseName}, ${course.code}, ${course.totalSemesters} semesters`}
      onClick={() => onSelect(course)}
    >
      <span className="course-copy">
        <span className="course-name">{course.courseName}</span>
        <span className="course-meta">
          <span className="course-code">{course.code}</span>
          <span className="meta-dot" aria-hidden="true">·</span>
          <span>{course.totalSemesters} {semesterLabel}</span>
        </span>
      </span>
      <ChevronRight className="course-chevron" aria-hidden="true" strokeWidth={1.8} />
    </button>
  )
}

export default CourseCard