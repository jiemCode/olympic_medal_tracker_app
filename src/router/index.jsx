import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Layout from '../components/layouts/Layout'

import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Classement from '../pages/Classement'

import PaysList from '../pages/pays/PaysList'
import PaysDetail from '../pages/pays/PaysDetail'
import PaysFormPage from '../pages/pays/PaysFormPage'

import AthletesList from '../pages/athletes/AthletesList'
import AthleteDetail from '../pages/athletes/AthleteDetail'
import AthleteFormPage from '../pages/athletes/AthleteFormPage'

import CompetitionsList from '../pages/competitions/CompetitionsList'
import CompetitionDetail from '../pages/competitions/CompetitionDetail'
import CompetitionFormPage from '../pages/competitions/CompetitionFormPage'

import MedaillesList from '../pages/medailles/MedaillesList'
import MedailleFormPage from '../pages/medailles/MedailleFormPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/classement" replace /> },
  { path: '/login', element: <Login /> },
  {
    element: <Layout />,
    children: [
      // For all users
      { path: '/classement',          element: <Classement /> },
      { path: '/pays',                element: <PaysList /> },
      { path: '/pays/:id',            element: <PaysDetail /> },
      { path: '/athletes',            element: <AthletesList /> },
      { path: '/athletes/:id',        element: <AthleteDetail /> },
      { path: '/competitions',        element: <CompetitionsList /> },
      { path: '/competitions/:id',    element: <CompetitionDetail /> },
      { path: '/medailles',           element: <MedaillesList /> },

      // For admins only
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/pays/nouveau',              element: <PaysFormPage /> },
          { path: '/pays/:id/modifier',         element: <PaysFormPage /> },
          { path: '/athletes/nouveau',          element: <AthleteFormPage /> },
          { path: '/athletes/:id/modifier',     element: <AthleteFormPage /> },
          { path: '/competitions/nouveau',      element: <CompetitionFormPage /> },
          { path: '/competitions/:id/modifier', element: <CompetitionFormPage /> },
          { path: '/medailles/attribuer',       element: <MedailleFormPage /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
