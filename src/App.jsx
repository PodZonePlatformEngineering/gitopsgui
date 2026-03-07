import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'

// Role-gated view placeholders — implemented in GITGUI-015 through GITGUI-026
const Dashboard      = React.lazy(() => import('./views/Dashboard'))
const Clusters       = React.lazy(() => import('./views/Clusters'))
const Applications   = React.lazy(() => import('./views/Applications'))
const Pipelines      = React.lazy(() => import('./views/Pipelines'))
const PRReviews      = React.lazy(() => import('./views/PRReviews'))
const History        = React.lazy(() => import('./views/History'))
const Interrogation  = React.lazy(() => import('./views/Interrogation'))

export default function App() {
  const { role, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!role)   return <div>Unauthorised</div>

  return (
    <React.Suspense fallback={<div>Loading view...</div>}>
      <Layout role={role}>
        <Routes>
          {/* Cluster Operator */}
          {role === 'cluster_operator' && (
            <>
              <Route path="/"              element={<Dashboard />} />
              <Route path="/clusters"      element={<Clusters />} />
              <Route path="/applications"  element={<Applications />} />
              <Route path="/prs"           element={<PRReviews />} />
              <Route path="/interrogation" element={<Interrogation />} />
            </>
          )}

          {/* Build Manager */}
          {role === 'build_manager' && (
            <>
              <Route path="/"              element={<Pipelines />} />
              <Route path="/pipelines"     element={<Pipelines />} />
              <Route path="/prs"           element={<PRReviews />} />
              <Route path="/history"       element={<History />} />
              <Route path="/interrogation" element={<Interrogation />} />
            </>
          )}

          {/* Senior Developer */}
          {role === 'senior_developer' && (
            <>
              <Route path="/"              element={<Interrogation />} />
              <Route path="/interrogation" element={<Interrogation />} />
              <Route path="/clusters"      element={<Clusters />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </React.Suspense>
  )
}
