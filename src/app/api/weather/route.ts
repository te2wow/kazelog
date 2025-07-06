import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/weather')

app.get('/latest-time', async (c) => {
  try {
    const response = await fetch('https://www.jma.go.jp/bosai/amedas/data/latest_time.txt')
    const latestTime = await response.text()
    return c.json({ latestTime: latestTime.trim() })
  } catch (error) {
    console.error('Error fetching latest time:', error)
    return c.json({ error: 'Failed to fetch latest time' }, 500)
  }
})

app.get('/amedas/:timestamp', async (c) => {
  try {
    const timestamp = c.req.param('timestamp')
    const response = await fetch(`https://www.jma.go.jp/bosai/amedas/data/map/${timestamp}00.json`)
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error('Error fetching AMeDAS data:', error)
    return c.json({ error: 'Failed to fetch AMeDAS data' }, 500)
  }
})

app.get('/stations', async (c) => {
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