import { Center, Image, Paper, Stack } from '@mantine/core'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <Center mih="100vh" bg="graphite.8" p="md">
      <Stack align="center" gap="xl" w={380} maw="100%">
        <Image src="/logo-full.png" alt="Atual Diesel" w={260} fit="contain" />
        <Paper withBorder shadow="md" p="xl" radius="md" w="100%" bg="white">
          <Stack gap="lg">
            <Outlet />
          </Stack>
        </Paper>
      </Stack>
    </Center>
  )
}
