import { Box, Group, Paper, Stack, Text } from '@mantine/core'
import type { StatusBarItem } from '../utils/statusOs'

export function StatusBarList({ items }: { items: StatusBarItem[] }) {
  const max = Math.max(1, ...items.map((item) => item.quantidade))

  return (
    <Stack gap={8}>
      {items.map((item) => (
        <Paper key={item.key} withBorder bg="gray.0" radius="md" px="sm" py={8}>
          <Group gap={10} wrap="nowrap">
            <Box
              w={9}
              h={9}
              style={{ borderRadius: '50%', background: `var(--mantine-color-${item.color}-6)`, flexShrink: 0 }}
            />
            <Text size="sm" w={150} style={{ flexShrink: 0 }}>
              {item.label}
            </Text>
            <Box style={{ flex: 1, height: 8, background: 'var(--mantine-color-gray-2)', borderRadius: 999 }}>
              <Box
                style={{
                  height: '100%',
                  width: `${(item.quantidade / max) * 100}%`,
                  background: `var(--mantine-color-${item.color}-6)`,
                  borderRadius: 999,
                  transition: 'width 200ms ease',
                }}
              />
            </Box>
            <Text size="sm" fw={700} w={26} ta="right" style={{ flexShrink: 0 }}>
              {item.quantidade}
            </Text>
          </Group>
        </Paper>
      ))}
      {items.every((item) => item.quantidade === 0) && (
        <Text size="sm" c="dimmed">
          Sem ordens de serviço registradas ainda.
        </Text>
      )}
    </Stack>
  )
}
