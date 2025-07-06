import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const { timestamp } = c.req.param()
    const response = await fetch(`https://www.jma.go.jp/bosai/amedas/data/map/${timestamp}00.json`)
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error('Error fetching AMeDAS data:', error)
    return c.json({ error: 'Failed to fetch AMeDAS data' }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)