import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const response = await fetch('https://www.jma.go.jp/bosai/amedas/const/amedastable.json')
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error('Error fetching stations:', error)
    return c.json({ error: 'Failed to fetch stations' }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)