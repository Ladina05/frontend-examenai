import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, ListTree } from 'lucide-react'
import { fetchCourseById } from '../api/courses'
import { fetchChaptersByCourse, fetchChapterById } from '../api/chapters'
import FileTypeBadge from '../components/FileTypeBadge'
import ChapterListItem from '../components/ChapterListItem'
import StatusBanner from '../components/StatusBanner'
import EmptyState from '../components/EmptyState'
import Spinner from '../components/Spinner'

export default function CourseDetailPage() {

}
