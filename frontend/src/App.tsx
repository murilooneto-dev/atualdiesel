import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { AuthProvider } from './contexts/AuthContext'
import { router } from './routes'

const queryClient = new QueryClient()

function App() {
  return (
    <MantineProvider defaultColorScheme="light">
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  )
}

export default App
