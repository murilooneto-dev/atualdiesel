import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { AppLayout } from '../layouts/AppLayout'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Login } from '../pages/auth/Login'
import { ForgotPassword } from '../pages/auth/ForgotPassword'
import { ResetPassword } from '../pages/auth/ResetPassword'
import { Dashboard } from '../pages/dashboard/Dashboard'
import { ClientsList } from '../pages/clients/ClientsList'
import { ClientDetail } from '../pages/clients/ClientDetail'
import { VehiclesList } from '../pages/vehicles/VehiclesList'
import { VehicleDetail } from '../pages/vehicles/VehicleDetail'
import { ServicesList } from '../pages/services/ServicesList'
import { ChecklistPage } from '../pages/checklist/ChecklistPage'
import { ServiceOrdersList } from '../pages/service-orders/ServiceOrdersList'
import { NewServiceOrder } from '../pages/service-orders/NewServiceOrder'
import { ServiceOrderDetail } from '../pages/service-orders/ServiceOrderDetail'
import { UsersList } from '../pages/users/UsersList'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/esqueci-senha', element: <ForgotPassword /> },
      { path: '/redefinir-senha', element: <ResetPassword /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/clientes', element: <ClientsList /> },
      { path: '/clientes/:id', element: <ClientDetail /> },
      { path: '/veiculos', element: <VehiclesList /> },
      { path: '/veiculos/:id', element: <VehicleDetail /> },
      { path: '/servicos', element: <ServicesList /> },
      { path: '/checklist', element: <ChecklistPage /> },
      { path: '/ordens-servico', element: <ServiceOrdersList /> },
      { path: '/ordens-servico/nova', element: <NewServiceOrder /> },
      { path: '/ordens-servico/:id', element: <ServiceOrderDetail /> },
      {
        path: '/usuarios',
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <UsersList />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
