import { createTheme, type MantineColorsTuple } from '@mantine/core'

// Extraído da logo oficial (engrenagem dourada sobre grafite/prata).
const amber: MantineColorsTuple = [
  '#fff9e0',
  '#ffefb8',
  '#ffe38a',
  '#ffd65c',
  '#fdcb3a',
  '#fcc400',
  '#fcc400',
  '#e0ac00',
  '#c79600',
  '#a37b00',
]

const graphite: MantineColorsTuple = [
  '#f4f4f5',
  '#d4d4d8',
  '#a1a1aa',
  '#71717a',
  '#52525b',
  '#3f3f46',
  '#27272a',
  '#1f1f22',
  '#1c1c1e',
  '#0e0e10',
]

export const theme = createTheme({
  primaryColor: 'amber',
  primaryShade: { light: 5, dark: 5 },
  colors: { amber, graphite },
  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
})
