import { useEffect, useState } from 'react'
import { BookOpen, UploadCloud } from 'lucide-react'
import { fetchCourses, uploadCourse, deleteCourse } from '../api/courses'
import FileDropZone from '../components/FileDropZone'
import CourseCard from '../components/CourseCard'
import StatusBanner from '../components/StatusBanner'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'

export default function CoursesPage() {

}
