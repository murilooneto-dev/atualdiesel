import { useState } from 'react'
import { Alert, Button, PasswordInput, Stack } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError('Não foi possível redefinir a senha. Solicite um novo link.')
      return
    }
    navigate('/login')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}
        <PasswordInput
          label="Nova senha"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Button type="submit" loading={loading} fullWidth>
          Redefinir senha
        </Button>
      </Stack>
    </form>
  )
}
