/ ============================================
// 1. 更新 netlify/functions/ai-service.ts (完整版)
// ============================================

import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { prompt, systemMessage, action, temperature = 0.7, maxTokens = 2000 } = JSON.parse(event.body || '{}')
    
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Service configuration error' })
      }
    }

    console.log('Calling OpenAI API with action:', action)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: temperature,
        max_tokens: maxTokens
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: '未知错误' } }))
      console.error('OpenAI API error:', errorData)
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: `API调用失败: ${errorData.error?.message || '未知错误'}` 
        })
      }
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content })
    }
  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}
