// utils/aiService.ts - 完整修复版本
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
  private apiKey: string
  private baseURL = 'https://api.openai.com/v1/chat/completions'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

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
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的HR和职业规划师，专门帮助求职者分析他们的背景并推荐合适的技能。请根据用户的教育背景和个人信息，推荐8-10个最相关的技能。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: '未知错误' } }))
        throw new Error(`API调用失败: ${response.status} - ${errorData.error?.message || '未知错误'}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

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
    "name": "Java",
    "level": "advanced",
    "category": "编程语言",
    "description": "企业级应用开发",
    "reason": "计算机专业核心技能",
    "selected": true
  }
]

要求：
1. level只能是: beginner, intermediate, advanced, expert
2. 前5个技能设置selected为true，其余为false
3. 必须返回有效的JSON数组格式

JSON:`
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
        {
          name: 'Python',
          level: 'intermediate',
          category: '编程语言',
          description: '数据处理和Web开发',
          reason: '应用范围广泛，容易上手',
          selected: true
        },
        {
          name: 'React',
          level: 'intermediate',
          category: '前端框架',
          description: '现代前端界面开发',
          reason: '前端开发主流框架',
          selected: true
        },
        {
          name: 'MySQL',
          level: 'intermediate',
          category: '数据库',
          description: '关系型数据库设计',
          reason: '后端开发必备技能',
          selected: true
        },
        {
          name: 'Git',
          level: 'intermediate',
          category: '版本控制',
          description: '代码版本管理',
          reason: '团队开发必备',
          selected: true
        }
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
        {
          name: '沟通协调',
          level: 'intermediate',
          category: '软技能',
          description: '团队协作能力',
          reason: '职场必备能力',
          selected: true
        },
        {
          name: '项目管理',
          level: 'beginner',
          category: '管理技能',
          description: '项目计划执行',
          reason: '职业发展技能',
          selected: true
        },
        {
          name: '数据分析',
          level: 'beginner',
          category: '分析技能',
          description: '数据处理分析',
          reason: '现代工作技能',
          selected: true
        },
        {
          name: '英语',
          level: 'intermediate',
          category: '语言技能',
          description: '商务英语能力',
          reason: '国际化需求',
          selected: true
        }
      ]
    }

    return fallbackSkills[major] || fallbackSkills['默认']
  }
}

const createAIService = (): AIService | null => {
  const apiKey = (typeof window !== 'undefined' && import.meta?.env?.VITE_OPENAI_API_KEY) || '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'
  
  if (!apiKey) {
    console.warn('未配置OpenAI API Key，将使用模拟数据')
    return null
  }
  
  return new AIService(apiKey)
}

export { AIService, createAIService }
export type { RecommendedSkill }
