import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { Wawa } from '@/brand/Wawa'
import { useProgress } from '@/store/useProgress'

import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'

// Route-level splitting keeps the first paint small; the curriculum data is heavy.
const Path = lazy(() => import('@/pages/Path'))
const Lesson = lazy(() => import('@/pages/Lesson'))
const UnitNotes = lazy(() => import('@/pages/UnitNotes'))
const Review = lazy(() => import('@/pages/Review'))
const Scripts = lazy(() => import('@/pages/Scripts'))
const Writing = lazy(() => import('@/pages/Writing'))
const Exams = lazy(() => import('@/pages/Exams'))
const Reference = lazy(() => import('@/pages/Reference'))
const Method = lazy(() => import('@/pages/Method'))
const Profile = lazy(() => import('@/pages/Profile'))

function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <Wawa expression="thinking" size={130} className="anim-bob" />
      <span className="font-display text-[14px] font-extrabold text-ink-faint">Memuat…</span>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="py-16 text-center">
      <Wawa expression="wow" size={180} className="mx-auto" />
      <h1 className="mt-4 text-3xl">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-[15px] text-ink-soft">Wawa juga bingung. Coba kembali ke beranda.</p>
    </div>
  )
}

export default function App() {
  const onboarded = useProgress((s) => s.onboarded)
  const touchStreak = useProgress((s) => s.touchStreak)

  // Refill hearts and roll the streak forward once per app open.
  useEffect(() => {
    if (onboarded) touchStreak()
  }, [onboarded, touchStreak])

  return (
    <BrowserRouter>
      <ScrollToTop />
      {!onboarded ? (
        <Routes>
          <Route path="/mulai" element={<Onboarding />} />
          <Route path="*" element={<Navigate to="/mulai" replace />} />
        </Routes>
      ) : (
        <Shell>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mulai" element={<Navigate to="/" replace />} />
              <Route path="/belajar/:lang" element={<Path />} />
              <Route path="/pelajaran/:lang/:id" element={<Lesson />} />
              <Route path="/materi/:lang/:unitId" element={<UnitNotes />} />
              <Route path="/ulang" element={<Review />} />
              <Route path="/aksara" element={<Scripts />} />
              <Route path="/menulis" element={<Writing />} />
              <Route path="/ujian" element={<Exams />} />
              <Route path="/referensi" element={<Reference />} />
              <Route path="/metode" element={<Method />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Shell>
      )}
    </BrowserRouter>
  )
}
