import { useState } from 'react'
import { Alert, Anchor, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Email ou senha inválidos.')
      return
    }
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}
        <TextInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <PasswordInput
          label="Senha"
          required
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Button type="submit" loading={loading} fullWidth>
          Entrar
        </Button>
        <Anchor component={Link} to="/esqueci-senha" size="sm" ta="center">
          Esqueci minha senha
        </Anchor>
      </Stack>
    </form>
  )
}
