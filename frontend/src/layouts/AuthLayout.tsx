import { Center, Paper, Stack, Title } from '@mantine/core'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <Center mih="100vh" bg="gray.0">
      <Paper withBorder shadow="sm" p="xl" radius="md" w={360}>
        <Stack gap="lg">
          <Title order={3} ta="center">
            Atual Diesel
          </Title>
          <Outlet />
        </Stack>
      </Paper>
    </Center>
  )
}
