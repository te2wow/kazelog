import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const { timestamp } = c.req.param()
    const response = await fetch(`https://www.jma.go.jp/bosai/amedas/data/map/${timestamp}00.json`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const text = await response.text()
    
    // Check if response is valid JSON
    if (!text.trim() || text.trim().length === 0) {
      throw new Error('Empty response from JMA API')
    }
    
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Response text:', text.substring(0, 200))
      throw new Error('Invalid JSON response from JMA API')
    }
    
    return c.json(data)
  } catch (error) {
    console.error('Error fetching AMeDAS data:', error)
    return c.json({ error: 'Failed to fetch AMeDAS data', details: error.message }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)