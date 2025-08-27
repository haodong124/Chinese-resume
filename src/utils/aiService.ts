// src/utils/aiService.ts - 修复版本，可直接覆盖

import type { PersonalInfo, Education, Experience, Project } from '../App'

// 简化的接口定义
interface SkillRecommendation {
  id: string
  skill: string
  level: 'understand' | 'proficient' | 'expert'
  category: string
  description: string
  value_proposition: string
  priority: 'high' | 'medium' | 'low'
  selected: boolean
  salaryImpact?: string
  learningTime?: string
  trend?: 'rising' | 'stable' | 'declining'
}

interface AchievementItem {
  id: string
  content: string
  metrics: {
    type: 'absolute' | 'percentage' | 'range' | 'qualitative'
    value: string
    confidence: number
  }
  relevance: {
    target_job_title: string
    score: number
  }
  tags: string[]
}

// 简化的事件总线
class SimpleEventBus {
  private handlers: Map<string, Function[]> = new Map()

  on(event: string, handler: Function) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }
    this.handlers.get(event)!.push(handler)
  }

  emit(event: string, data: any) {
    const eventHandlers = this.handlers.get(event) || []
    eventHandlers.forEach(handler => {
      try {
        handler(data)
      } catch (error) {
        console.error(`Event handler error for ${event}:`, error)
      }
    })
  }

  off(event: string, handler: Function) {
    const handlers = this.handlers.get(event) || []
    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
    }
  }

  clear() {
    this.handlers.clear()
  }
}

// 主AI服务类
class AIService {
  private baseURL: string
  private eventBus: SimpleEventBus

  constructor(eventBus?: SimpleEventBus) {
    this.baseURL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8888/.netlify/functions/ai-service'
      : '/.netlify/functions/ai-service'
    this.eventBus = eventBus || new SimpleEventBus()
  }

  // 核心AI调用方法
  private async makeAICall(prompt: string, systemMessage: string, action: string = 'general'): Promise<string> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemMessage,
          action,
          temperature: 0.7,
          maxTokens: 3000
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `API调用失败: ${response.status}`)
      }

      const data = await response.json()
      return data.content || ''
    } catch (error) {
      console.error('AI Service Error:', error)
      throw error
    }
  }

  // 公共AI调用方法（供组件使用）
  async callAI(prompt: string, systemMessage: string, maxTokens: number = 3000): Promise<string> {
    return this.makeAICall(prompt, systemMessage, 'general')
  }

  // AI服务1：技能推荐
  async generateSkillRecommendations(
    personalInfo: PersonalInfo, 
    education: Education[],
    targetJobTitle: string
  ): Promise<SkillRecommendation[]> {
    try {
      const educationText = education.map(edu => `${edu.degree} ${edu.major}`).join('、')
      
      const prompt = `基于以下信息推荐8-10个技能：

个人信息：
- 目标职位：${targetJobTitle}
- 教育背景：${educationText}

要求按JSON格式返回：
[
  {
    "skill": "技能名称",
    "level": "understand|proficient|expert",
    "category": "技能分类",
    "description": "具体应用描述",
    "value_proposition": "价值主张",
    "priority": "high|medium|low",
    "selected": true,
    "salaryImpact": "提升15-30%",
    "learningTime": "1-3个月",
    "trend": "rising|stable|declining"
  }
]

前6个技能设置selected为true。`

      const systemMessage = '你是专业的职业规划师，根据用户背景推荐相关技能。必须返回有效的JSON数组格式。'
      
      const content = await this.makeAICall(prompt, systemMessage, 'skill_recommendation')
      const skills = this.parseSkillRecommendations(content)
      
      // 发送事件
      this.eventBus.emit('skills.updated', skills)
      
      return skills
    } catch (error) {
      console.error('技能推荐失败:', error)
      throw error
    }
  }

  // AI服务2：工作经历优化
  async optimizeWorkExperience(
    workExperience: Experience[],
    targetJobTitle: string,
    personalInfo: PersonalInfo
  ): Promise<AchievementItem[]> {
    try {
      const experienceText = workExperience.map(exp => `
${exp.position} @ ${exp.company}
描述：${exp.description}
成就：${exp.achievements?.join('；') || '无'}
`).join('\n')

      const prompt = `优化以下工作经历为量化成就：

目标职位：${targetJobTitle}
工作经历：${experienceText}

返回JSON格式：
[
  {
    "content": "量化成就描述",
    "metrics": {
      "type": "percentage|absolute|qualitative",
      "value": "具体数值",
      "confidence": 0.8
    },
    "relevance": {
      "target_job_title": "${targetJobTitle}",
      "score": 0.9
    },
    "tags": ["相关标签"]
  }
]`

      const systemMessage = '你是简历写作专家，将工作经历转化为量化成就。避免夸张数字，确保真实可信。'
      
      const content = await this.makeAICall(prompt, systemMessage, 'work_optimization')
      const achievements = this.parseAchievements(content)
      
      // 发送事件
      this.eventBus.emit('work_achievements.updated', achievements)
      
      return achievements
    } catch (error) {
      console.error('工作经历优化失败:', error)
      throw error
    }
  }

  // AI服务3：项目经历美化
  async beautifyProjectExperience(
    projects: Project[],
    targetJobTitle: string,
    personalInfo: PersonalInfo
  ): Promise<AchievementItem[]> {
    try {
      const projectText = projects.map(proj => `
项目：${proj.name}
角色：${proj.role}
描述：${proj.description}
技术：${proj.technologies}
`).join('\n')

      const prompt = `美化以下项目经历：

目标职位：${targetJobTitle}
项目经历：${projectText}

返回量化项目成就的JSON格式，突出技术价值和业务影响。`

      const systemMessage = '你是项目成就提炼专家，将项目经历量化，突出技术价值。'
      
      const content = await this.makeAICall(prompt, systemMessage, 'project_beautification')
      const achievements = this.parseAchievements(content)
      
      // 发送事件
      this.eventBus.emit('project_achievements.updated', achievements)
      
      return achievements
    } catch (error) {
      console.error('项目经历美化失败:', error)
      throw error
    }
  }

  // 解析技能推荐
  private parseSkillRecommendations(content: string): SkillRecommendation[] {
    try {
      const jsonString = this.extractJSON(content)
      const skills = JSON.parse(jsonString)
      
      if (!Array.isArray(skills)) {
        throw new Error('返回的不是数组格式')
      }

      return skills.map((skill: any, index: number) => ({
        id: `skill-${Date.now()}-${index}`,
        skill: skill.skill || `技能${index + 1}`,
        level: ['understand', 'proficient', 'expert'].includes(skill.level) 
          ? skill.level : 'proficient',
        category: skill.category || '通用技能',
        description: skill.description || '',
        value_proposition: skill.value_proposition || '',
        priority: ['high', 'medium', 'low'].includes(skill.priority) 
          ? skill.priority : 'medium',
        selected: skill.selected === true || index < 6,
        salaryImpact: skill.salaryImpact || '有助提升',
        learningTime: skill.learningTime || '1-3个月',
        trend: ['rising', 'stable', 'declining'].includes(skill.trend) 
          ? skill.trend : 'stable'
      })).slice(0, 10)
    } catch (error) {
      console.error('解析技能推荐失败:', error)
      return this.getFallbackSkills()
    }
  }

  // 解析成就
  private parseAchievements(content: string): AchievementItem[] {
    try {
      const jsonString = this.extractJSON(content)
      const achievements = JSON.parse(jsonString)
      
      if (!Array.isArray(achievements)) {
        throw new Error('返回的不是数组格式')
      }

      return achievements.map((ach: any, index: number) => ({
        id: `achievement-${Date.now()}-${index}`,
        content: ach.content || '重要成就',
        metrics: {
          type: ach.metrics?.type || 'qualitative',
          value: ach.metrics?.value || '显著改善',
          confidence: ach.metrics?.confidence || 0.7
        },
        relevance: {
          target_job_title: ach.relevance?.target_job_title || '通用',
          score: ach.relevance?.score || 0.8
        },
        tags: ach.tags || ['工作成就']
      }))
    } catch (error) {
      console.error('解析成就失败:', error)
      return []
    }
  }

  // 提取JSON字符串
  private extractJSON(content: string): string {
    const jsonMatch = content.match(/\[[\s\S]*\]/) || content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return jsonMatch[0]
    }
    return content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  }

  // 备选技能
  private getFallbackSkills(): SkillRecommendation[] {
    return [
      {
        id: 'fallback-1',
        skill: 'Microsoft Office',
        level: 'proficient',
        category: '办公软件',
        description: '熟练使用Word、Excel、PowerPoint等办公软件',
        value_proposition: '提高日常工作效率',
        priority: 'high',
        selected: true,
        salaryImpact: '基础技能',
        learningTime: '1个月',
        trend: 'stable'
      },
      {
        id: 'fallback-2',
        skill: '沟通协调',
        level: 'proficient',
        category: '软技能',
        description: '良好的沟通表达和团队协作能力',
        value_proposition: '促进团队合作',
        priority: 'high',
        selected: true,
        salaryImpact: '软技能',
        learningTime: '持续提升',
        trend: 'rising'
      },
      {
        id: 'fallback-3',
        skill: '数据分析',
        level: 'understand',
        category: '分析技能',
        description: '基础的数据处理和分析能力',
        value_proposition: '支持决策制定',
        priority: 'medium',
        selected: true,
        salaryImpact: '提升10-20%',
        learningTime: '2-3个月',
        trend: 'rising'
      }
    ]
  }
}

// 简化的成就融合引擎
class SimpleAchievementFusionEngine {
  async fuseAchievements(
    skills: SkillRecommendation[],
    workAchievements: AchievementItem[],
    projectAchievements: AchievementItem[],
    targetJobTitle: string
  ): Promise<AchievementItem[]> {
    console.log('[融合引擎] 处理成就...')
    
    // 合并所有成就
    const allAchievements = [...workAchievements, ...projectAchievements]
    
    // 简单去重
    const uniqueAchievements = this.removeDuplicates(allAchievements)
    
    // 按相关性排序并取前8个
    const sortedAchievements = uniqueAchievements
      .sort((a, b) => b.relevance.score - a.relevance.score)
      .slice(0, 8)
    
    console.log('[融合引擎] 完成，输出', sortedAchievements.length, '项成就')
    return sortedAchievements
  }

  private removeDuplicates(achievements: AchievementItem[]): AchievementItem[] {
    const seen = new Set<string>()
    return achievements.filter(ach => {
      const key = ach.content.slice(0, 30)
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
}

// 导出实例
export const eventBus = new SimpleEventBus()
export const aiService = new AIService(eventBus)
export const achievementFusionEngine = new SimpleAchievementFusionEngine()

// 向后兼容
export const createAIService = () => aiService

export { AIService }
export type { SkillRecommendation, AchievementItem }
