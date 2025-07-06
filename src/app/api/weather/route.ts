import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const response = await fetch('https://www.jma.go.jp/bosai/amedas/data/latest_time.txt')
    const latestTime = await response.text()
    return c.json({ latestTime: latestTime.trim() })
  } catch (error) {
    console.error('Error fetching latest time:', error)
    return c.json({ error: 'Failed to fetch latest time' }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)