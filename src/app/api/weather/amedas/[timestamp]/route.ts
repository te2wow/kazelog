import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { timestamp: string } }
) {
  try {
    const { timestamp } = params
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
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching AMeDAS data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AMeDAS data', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}