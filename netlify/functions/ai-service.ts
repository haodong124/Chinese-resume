// ============================================
// netlify/functions/ai-service.ts - 增强版本
// ============================================

import type { Handler } from '@netlify/functions'

interface AIRequest {
  prompt: string
  systemMessage: string
  action: string
  temperature?: number
  maxTokens?: number
}

interface AIResponse {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  performance?: {
    duration: number
    timestamp: string
  }
}

export const handler: Handler = async (event) => {
  const startTime = Date.now()
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // 预检请求处理
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
    // 解析请求体
    const requestBody: AIRequest = JSON.parse(event.body || '{}')
    const { 
      prompt, 
      systemMessage, 
      action = 'general',
      temperature = 0.7, 
      maxTokens = 3000 
    } = requestBody

    // 验证必需参数
    if (!prompt || !systemMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: '缺少必需参数：prompt 和 systemMessage' 
        })
      }
    }

    // 获取API密钥
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: '服务配置错误，请联系管理员',
          code: 'MISSING_API_KEY'
        })
      }
    }

    console.log(`[AI服务] 处理请求: action=${action}, tokens=${maxTokens}`)

    // 根据action调整模型选择和参数
    let model = 'gpt-3.5-turbo'
    let adjustedMaxTokens = maxTokens

    // 为不同action优化参数
    switch (action) {
      case 'job_analysis':
        adjustedMaxTokens = Math.min(maxTokens, 1500)
        break
      case 'skill_recommendation':
        adjustedMaxTokens = Math.min(maxTokens, 2500)
        break
      case 'work_optimization':
      case 'project_beautification':
        adjustedMaxTokens = Math.min(maxTokens, 2000)
        break
      case 'general':
      default:
        adjustedMaxTokens = Math.min(maxTokens, 3000)
    }

    // 调用OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: 'system', 
            content: systemMessage 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature,
        max_tokens: adjustedMaxTokens,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({ 
        error: { message: '未知API错误' } 
      }))
      
      console.error('OpenAI API error:', {
        status: openaiResponse.status,
        error: errorData.error?.message,
        action
      })

      // 根据不同错误返回不同信息
      let errorMessage = 'AI服务暂时不可用'
      if (openaiResponse.status === 429) {
        errorMessage = 'AI服务请求过于频繁，请稍后重试'
      } else if (openaiResponse.status === 401) {
        errorMessage = 'AI服务认证失败'
      } else if (openaiResponse.status >= 500) {
        errorMessage = 'AI服务器内部错误，请稍后重试'
      }

      return {
        statusCode: openaiResponse.status,
        headers,
        body: JSON.stringify({ 
          error: errorMessage,
          details: errorData.error?.message,
          code: 'OPENAI_API_ERROR'
        })
      }
    }

    const data = await openaiResponse.json()
    const content = data.choices[0]?.message?.content || ''
    
    if (!content) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'AI返回内容为空',
          code: 'EMPTY_RESPONSE'
        })
      }
    }

    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(`[AI服务] 完成请求: action=${action}, duration=${duration}ms, tokens=${data.usage?.total_tokens || 0}`)

    // 构建响应
    const response: AIResponse = {
      content,
      usage: data.usage,
      performance: {
        duration,
        timestamp: new Date().toISOString()
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    }

  } catch (error) {
    const endTime = Date.now()
    const duration = endTime - startTime

    console.error('Function error:', {
      error: error instanceof Error ? error.message : error,
      duration,
      stack: error instanceof Error ? error.stack : undefined
    })

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '服务内部错误',
        details: error instanceof Error ? error.message : '未知错误',
        code: 'INTERNAL_ERROR'
      })
    }
  }
}
