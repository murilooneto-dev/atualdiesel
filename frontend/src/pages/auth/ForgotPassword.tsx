import { useState } from 'react'
import { Alert, Anchor, Button, Stack, Text, TextInput } from '@mantine/core'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    setLoading(false)
    if (error) {
      setError('Não foi possível enviar o email. Tente novamente.')
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <Stack gap="md">
        <Text size="sm">Se o email existir, enviamos um link de redefinição de senha.</Text>
        <Anchor component={Link} to="/login" size="sm" ta="center">
          Voltar ao login
        </Anchor>
      </Stack>
    )
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
        <Button type="submit" loading={loading} fullWidth>
          Enviar link de redefinição
        </Button>
        <Anchor component={Link} to="/login" size="sm" ta="center">
          Voltar ao login
        </Anchor>
      </Stack>
    </form>
  )
}
