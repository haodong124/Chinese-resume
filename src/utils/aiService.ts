// ============================================
// 2. 更新 src/utils/aiService.ts (完整重写)
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
  private baseURL: string

  constructor() {
    // 自动检测环境
    this.baseURL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8888/.netlify/functions/ai-service'
      : '/.netlify/functions/ai-service'
  }

  private async callAIFunction(prompt: string, systemMessage: string, action: string = 'default', maxTokens: number = 2000): Promise<string> {
    try {
      console.log('Calling AI function at:', this.baseURL)
      
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemMessage,
          action,
          temperature: 0.7,
          maxTokens
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `API调用失败: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.content) {
        throw new Error('AI返回内容为空')
      }

      return data.content
    } catch (error) {
      console.error('AI Service Error:', error)
      throw error
    }
  }

  async generateSkillRecommendations(
    personalInfo: PersonalInfo, 
    education: Education[]
  ): Promise<RecommendedSkill[]> {
    const prompt = this.buildSkillRecommendationPrompt(personalInfo, education)
    
    try {
      const content = await this.callAIFunction(
        prompt,
        '你是一个专业的HR和职业规划师，专门帮助求职者分析他们的背景并推荐合适的技能。请根据用户的教育背景和个人信息，推荐8-10个最相关的技能。',
        'skills',
        2000
      )

      return this.parseSkillRecommendations(content)
    } catch (error) {
      console.error('AI技能推荐失败，使用备选方案:', error)
      return this.getFallbackRecommendations(education)
    }
  }

  // 新增：通用AI调用方法（供其他组件使用）
  async callAI(prompt: string, systemMessage: string, maxTokens: number = 3000): Promise<string> {
    return this.callAIFunction(prompt, systemMessage, 'general', maxTokens)
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

// 创建单例实例
const createAIService = (): AIService => {
  return new AIService()
}

export { AIService, createAIService }
export type { RecommendedSkill }

// ============================================
// 3. 更新 EnhancedAISkillRecommendation.tsx 中的 callAIService
// ============================================

// 在 EnhancedAISkillRecommendation.tsx 文件中，替换 callAIService 函数：

import { createAIService } from '../utils/aiService'

// 在组件内部：
const aiService = createAIService()

// 替换原来的 callAIService 函数调用为：
const callAIService = async (prompt: string, systemMessage: string) => {
  return await aiService.callAI(prompt, systemMessage)
}

// 生成AI技能推荐 - 使用新的服务
const generateAISkillRecommendations = async () => {
  try {
    setAiError(null)
    const skills = await aiService.generateSkillRecommendations(personalInfo, education)
    setRecommendedSkills(skills.map(skill => ({
      ...skill,
      priority: 'high' as const,
      salaryImpact: '提升15-30%',
      learningTime: '1-3个月',
      trend: 'rising' as const
    })))
  } catch (error) {
    console.error('AI技能推荐失败:', error)
    setAiError('AI推荐服务暂时不可用，使用智能备选推荐')
    const fallbackSkills = getIntelligentFallbackSkills()
    setRecommendedSkills(fallbackSkills)
  }
}

// ============================================
// 4. 更新 EnhancedSkillSuggestions.tsx
// ============================================

import React, { useState } from 'react'
import { Lightbulb, Loader2, Plus, Sparkles } from 'lucide-react'
import { ResumeData } from '../App'
import { createAIService } from '../utils/aiService'

interface SkillSuggestion {
  skill: string
  reason: string
  category: string
}

interface EnhancedSkillSuggestionsProps {
  resumeData: ResumeData
  onAddSkill: (skill: string) => void
}

const EnhancedSkillSuggestions: React.FC<EnhancedSkillSuggestionsProps> = ({ 
  resumeData, 
  onAddSkill 
}) => {
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const aiService = createAIService()

  const generateSkillSuggestions = async () => {
    setLoading(true)
    setError(null)

    try {
      const resumeSummary = {
        experience: resumeData.experience.map(exp => 
          `${exp.position}在${exp.company}: ${exp.description}`
        ).join('\n'),
        projects: resumeData.projects.map(proj => 
          `${proj.name}: ${proj.description} 技术栈: ${proj.technologies}`
        ).join('\n'),
        currentSkills: resumeData.skills || ''
      }

      const prompt = `工作经历：${resumeSummary.experience}\n\n项目经验：${resumeSummary.projects}\n\n现有技能：${resumeSummary.currentSkills}\n\n请推荐相关技能。`
      
      const systemMessage = '你是一个专业的职业规划师。基于用户的工作经历和项目经验，推荐5-6个最有价值的技能。请以JSON数组格式返回，每个技能包含skill(技能名称)、reason(推荐理由)、category(技能分类)三个字段。'

      const content = await aiService.callAI(prompt, systemMessage, 1000)
      
      // 解析返回的JSON
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        const jsonContent = jsonMatch ? jsonMatch[0] : content
        const parsedSuggestions = JSON.parse(jsonContent)
        setSuggestions(parsedSuggestions.slice(0, 6))
      } catch (parseError) {
        throw new Error('解析AI响应失败')
      }
      
    } catch (error) {
      console.error('生成技能建议失败:', error)
      setError(error instanceof Error ? error.message : '生成失败')
      
      // 提供默认建议
      const fallbackSuggestions = [
        { skill: 'React', reason: '流行的前端框架，市场需求大', category: '前端框架' },
        { skill: 'Node.js', reason: '服务端JavaScript运行环境', category: '后端技术' },
        { skill: 'Python', reason: '多用途编程语言，AI/数据分析热门', category: '编程语言' },
        { skill: 'SQL', reason: '数据库查询语言，数据处理必备', category: '数据库' },
        { skill: 'Git', reason: '版本控制工具，开发必备技能', category: '开发工具' }
      ]
      setSuggestions(fallbackSuggestions)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = (skill: string) => {
    onAddSkill(skill)
    setSuggestions(prev => prev.filter(s => s.skill !== skill))
  }

  // ... 组件的其余部分保持不变
}

// ============================================
// 5. package.json 添加 Netlify CLI（用于本地测试）
// ============================================
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "netlify": "netlify dev"  // 新增：本地测试Netlify Functions
  },
  "devDependencies": {
    // ... 其他依赖
    "netlify-cli": "^17.0.0"  // 新增
  }
}

// ============================================
// 6. 本地测试命令
// ============================================
// 安装 Netlify CLI
npm install -D netlify-cli

// 本地运行（会同时启动Vite和Functions）
npm run netlify

// 或者直接运行
netlify dev
