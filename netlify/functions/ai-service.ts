// ============================================
// 步骤1: 创建 netlify/functions/ai-service.ts
// ============================================

import type { Handler } from '@netlify/functions'

const handler: Handler = async (event) => {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // 验证请求来源（可选，增加安全性）
  const origin = event.headers.origin || event.headers.referer
  const allowedOrigins = [
    'https://your-site.netlify.app',
    'http://localhost:3000'
  ]
  
  if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden' })
    }
  }

  try {
    const { prompt, systemMessage, action } = JSON.parse(event.body || '{}')
    
    // 从环境变量获取API Key（在Netlify后台设置）
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Service configuration error' })
      }
    }

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
        temperature: 0.7,
        max_tokens: action === 'skills' ? 2000 : 3000
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'AI service error' })
      }
    }

    const data = await response.json()
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: data.choices[0]?.message?.content || ''
      })
    }
  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}

export { handler }

// ============================================
// 步骤2: 更新 src/utils/aiService.ts
// ============================================

interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  title?: string
  summary?: string
}

interface Education {
  id: string
  school: string
  degree: string
  major: string
  duration: string
  description: string
  gpa?: string
}

interface RecommendedSkill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
  description: string
  reason: string
  selected: boolean
}

class AIService {
  private baseURL = '/.netlify/functions/ai-service'

  async generateSkillRecommendations(
    personalInfo: PersonalInfo, 
    education: Education[]
  ): Promise<RecommendedSkill[]> {
    const prompt = this.buildSkillRecommendationPrompt(personalInfo, education)
    
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemMessage: '你是一个专业的HR和职业规划师，专门帮助求职者分析他们的背景并推荐合适的技能。请根据用户的教育背景和个人信息，推荐8-10个最相关的技能。',
          action: 'skills'
        })
      })

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status}`)
      }

      const data = await response.json()
      const content = data.content

      if (!content) {
        throw new Error('AI返回内容为空')
      }

      return this.parseSkillRecommendations(content)
    } catch (error) {
      console.error('AI技能推荐失败:', error)
      return this.getFallbackRecommendations(education)
    }
  }

  private buildSkillRecommendationPrompt(personalInfo: PersonalInfo, education: Education[]): string {
    const educationText = education.map(edu => 
      `${edu.degree} - ${edu.major} (${edu.school})`
    ).join(', ')

    return `请为以下求职者推荐技能：

个人信息：
- 姓名：${personalInfo.name}
- 职位目标：${personalInfo.title || '未指定'}
- 教育背景：${educationText}
- 个人简介：${personalInfo.summary || '无'}

请按照以下JSON格式返回8-10个技能推荐：

[
  {
    "name": "技能名称",
    "level": "advanced",
    "category": "技能类别",
    "description": "技能描述",
    "reason": "推荐理由",
    "selected": true
  }
]

要求：
1. level只能是: beginner, intermediate, advanced, expert
2. 前5个技能设置selected为true，其余为false
3. 必须返回有效的JSON数组格式`
  }

  private parseSkillRecommendations(content: string): RecommendedSkill[] {
    try {
      let jsonString = content.trim()
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        jsonString = jsonMatch[0]
      }
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      
      const skills = JSON.parse(jsonString)
      
      if (!Array.isArray(skills)) {
        throw new Error('返回的不是数组格式')
      }

      return skills.map((skill: any, index: number) => ({
        name: skill.name || `技能${index + 1}`,
        level: ['beginner', 'intermediate', 'advanced', 'expert'].includes(skill.level) 
          ? skill.level 
          : 'intermediate',
        category: skill.category || '通用技能',
        description: skill.description || '',
        reason: skill.reason || '',
        selected: skill.selected === true || index < 5
      })).slice(0, 10)
      
    } catch (error) {
      console.error('解析AI返回内容失败:', error)
      throw error
    }
  }

  private getFallbackRecommendations(education: Education[]): RecommendedSkill[] {
    // 保持原有的fallback逻辑
    const major = education[0]?.major || ''
    
    const fallbackSkills: Record<string, RecommendedSkill[]> = {
      '计算机科学与技术': [
        {
          name: 'Java',
          level: 'advanced',
          category: '编程语言',
          description: '企业级应用开发的主流语言',
          reason: '计算机专业核心技能，市场需求量大',
          selected: true
        },
        // ... 其他技能
      ],
      '默认': [
        {
          name: 'Microsoft Office',
          level: 'intermediate',
          category: '办公软件',
          description: 'Office办公套件',
          reason: '职场基础技能',
          selected: true
        },
        // ... 其他技能
      ]
    }

    return fallbackSkills[major] || fallbackSkills['默认']
  }
}

const createAIService = (): AIService => {
  // 不再需要API Key，直接返回服务实例
  return new AIService()
}

export { AIService, createAIService }
export type { RecommendedSkill }

// ============================================
// 步骤3: 创建 netlify.toml 配置文件
// ============================================
`
[build]
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# 安全头部
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
`
