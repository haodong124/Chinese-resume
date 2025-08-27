// ============================================
// src/utils/aiService.ts - 完整重写版本
// ============================================

// 导入现有接口
import type { PersonalInfo, Education, Experience, Project, Language, Achievement, IndustryAnalysis } from '../App'

// 统一数据契约接口
interface UnifiedDataContract {
  id?: string
  source: 'skills' | 'work_achievements' | 'project_achievements'
  timestamp: string
  confidence: number
}

interface SkillRecommendation extends UnifiedDataContract {
  skill: string
  category: 'software' | 'hardware' | 'soft_skill' | 'technical' | 'management'
  level: 'understand' | 'proficient' | 'expert'
  description: string
  value_proposition: string
  evidence?: Array<{ source: string; note?: string }>
  priority: 'high' | 'medium' | 'low'
  selected: boolean
  salaryImpact?: string
  learningTime?: string
  trend?: 'rising' | 'stable' | 'declining'
}

interface AchievementItem extends UnifiedDataContract {
  title?: string
  content: string
  metrics: {
    type: 'absolute' | 'percentage' | 'range' | 'qualitative'
    value: string
    baseline?: string
    period?: string
    confidence: number
  }
  relevance: {
    target_job_title: string
    score: number
  }
  freshness: string
  tags: string[]
}

interface ISVValidationResult {
  isValid: boolean
  confidence: number
  suggestedValue?: string
  reason?: string
}

// 行业标准校验器
class IndustryStandardValidator {
  static validateMetrics(achievement: AchievementItem): ISVValidationResult {
    const { metrics } = achievement
    
    if (metrics.type === 'percentage') {
      const value = parseFloat(metrics.value)
      if (value > 100) {
        return {
          isValid: false,
          confidence: 0.1,
          suggestedValue: '显著提升',
          reason: '百分比超过100%不现实'
        }
      }
      if (value > 50 && metrics.confidence < 0.7) {
        return {
          isValid: false,
          confidence: 0.3,
          suggestedValue: `约${Math.round(value/2)}%-${value}%`,
          reason: '高百分比需要更强证据支撑'
        }
      }
    }
    
    if (metrics.type === 'absolute') {
      const timeMatch = metrics.value.match(/(\d+)(小时|天|周|月)/);
      if (timeMatch) {
        const amount = parseInt(timeMatch[1])
        const unit = timeMatch[2]
        
        if (unit === '小时' && amount > 40) {
          return {
            isValid: false,
            confidence: 0.2,
            suggestedValue: '大幅节省时间',
            reason: '时间节省量可能过高'
          }
        }
      }
    }
    
    return {
      isValid: true,
      confidence: metrics.confidence
    }
  }
  
  static enhanceDescription(content: string, metrics: AchievementItem['metrics']): string {
    if (metrics.type === 'percentage') {
      return content.replace(/提升(\d+)%/, '提升约$1%')
    }
    
    if (metrics.type === 'absolute') {
      return content.replace(/节省(\d+)(小时|天)/, '节省近$1$2')
    }
    
    return content
  }
}

// 事件总线
class EventBus {
  private events: Map<string, Function[]> = new Map()

  emit(eventType: string, data: any) {
    const handlers = this.events.get(eventType) || []
    handlers.forEach(handler => handler(data))
    console.log(`[事件] ${eventType}:`, data.length || 0, '项数据')
  }

  on(eventType: string, handler: Function) {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, [])
    }
    this.events.get(eventType)!.push(handler)
  }

  off(eventType: string, handler: Function) {
    const handlers = this.events.get(eventType) || []
    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
    }
  }

  clear() {
    this.events.clear()
  }
}

// 性能监控
class PerformanceMonitor {
  private metrics: Map<string, number> = new Map()

  start(label: string) {
    this.metrics.set(label, Date.now())
  }

  end(label: string): number {
    const startTime = this.metrics.get(label)
    if (!startTime) return 0
    
    const duration = Date.now() - startTime
    console.log(`[性能] ${label}: ${duration}ms`)
    this.metrics.delete(label)
    return duration
  }
}

// 主要AI服务类
class AIService {
  private baseURL: string
  private eventBus: EventBus
  private monitor: PerformanceMonitor

  constructor(eventBus?: EventBus) {
    this.baseURL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8888/.netlify/functions/ai-service'
      : '/.netlify/functions/ai-service'
    this.eventBus = eventBus || new EventBus()
    this.monitor = new PerformanceMonitor()
  }

  private async callAI(prompt: string, systemMessage: string, action: string = 'general'): Promise<string> {
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

  // AI服务1：深度技能推荐
  async generateSkillRecommendations(
    personalInfo: PersonalInfo, 
    education: Education[],
    targetJobTitle: string
  ): Promise<SkillRecommendation[]> {
    this.monitor.start('skill-recommendations')
    
    try {
      // Task 1: 岗位深度解构
      const jobAnalysisPrompt = `
分析职位"${targetJobTitle}"的核心职责与技能需求：

用户背景：
- 教育：${education.map(e => `${e.degree} ${e.major}`).join('、')}
- 目标职位：${targetJobTitle}

请按以下格式返回分析结果：
{
  "core_responsibilities": ["职责1", "职责2", ...],
  "required_tools": ["工具1", "工具2", ...],
  "skill_categories": {
    "software": ["软件1", "软件2", ...],
    "hardware": ["硬件1", "硬件2", ...],
    "soft_skills": ["软技能1", "软技能2", ...]
  }
}`

      const analysisResult = await this.callAI(
        jobAnalysisPrompt,
        '你是资深行业分析师，精通各职位的技术栈和技能要求分工。',
        'job_analysis'
      )

      const analysis = JSON.parse(this.extractJSON(analysisResult))
      
      // Task 2A/2B: 基于分析结果推荐技能
      const recommendationPrompt = `
基于职位分析结果，为"${targetJobTitle}"推荐10-12个具体技能：

分析结果：${JSON.stringify(analysis)}

要求严格按照以下JSON Schema格式返回：
[
  {
    "skill": "具体技能名称",
    "category": "software|hardware|soft_skill|technical|management",
    "level": "understand|proficient|expert", 
    "description": "用于完成…[具体应用]，能够…[达成效果]",
    "value_proposition": "从而帮助…[团队/公司]实现…[可量化价值]",
    "evidence": [{"source": "建议学习资源", "note": "说明"}],
    "priority": "high|medium|low",
    "selected": true,
    "salaryImpact": "提升15-30%",
    "learningTime": "1-3个月",
    "trend": "rising|stable|declining"
  }
]

注意：
- 前8个技能设置selected为true
- 根据2024-2025年市场趋势调整
- 包含具体软件名称，避免泛泛而谈`

      const recommendationsResult = await this.callAI(
        recommendationPrompt,
        '你是世界顶级的HR专家和职业规划师，拥有20年行业经验，深度了解AI和数字化转型对技能要求的影响。',
        'skill_recommendation'
      )

      const rawRecommendations = JSON.parse(this.extractJSON(recommendationsResult))
      
      // 转换为统一数据契约格式
      const recommendations: SkillRecommendation[] = rawRecommendations.map((skill: any, index: number) => ({
        id: `skill-${Date.now()}-${index}`,
        source: 'skills' as const,
        timestamp: new Date().toISOString(),
        confidence: 0.85,
        skill: skill.skill,
        category: skill.category,
        level: skill.level,
        description: skill.description,
        value_proposition: skill.value_proposition,
        evidence: skill.evidence || [],
        priority: skill.priority,
        selected: skill.selected,
        salaryImpact: skill.salaryImpact,
        learningTime: skill.learningTime,
        trend: skill.trend
      }))

      // 发送事件
      this.eventBus.emit('skills.updated', recommendations)
      this.monitor.end('skill-recommendations')
      
      return recommendations
    } catch (error) {
      this.monitor.end('skill-recommendations')
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
    this.monitor.start('work-optimization')
    
    try {
      const prompt = `
优化以下工作经历，生成量化成就：

目标职位：${targetJobTitle}
个人背景：${personalInfo.name}

工作经历：
${workExperience.map(exp => `
${exp.position} @ ${exp.company} (${exp.duration})
${exp.isInternship ? '[实习]' : '[正式工作]'}
描述：${exp.description}
已有成就：${exp.achievements?.join('；') || '无'}
`).join('\n\n')}

要求按以下JSON Schema格式返回优化后的成就：
[
  {
    "content": "动词+动作+结果的成就描述",
    "metrics": {
      "type": "absolute|percentage|range|qualitative",
      "value": "具体数值或描述", 
      "baseline": "对比基准（可选）",
      "period": "时间范围（可选）",
      "confidence": 0.8
    },
    "relevance": {
      "target_job_title": "${targetJobTitle}",
      "score": 0.9
    },
    "freshness": "2024-08",
    "tags": ["相关技能", "业务域", "工具"]
  }
]

ISV校验要求：
1. 避免>30%的夸张数字，优先使用5-15%或绝对值
2. 支持"约/近/超过"等修饰词
3. 突出过程和职责，而非仅结果
4. 确保量化指标的合理性和可信度`

      const result = await this.callAI(
        prompt,
        '你是资深简历写作专家，擅长将工作经历转化为量化成就，严格遵守行业标准校验规则，确保真实性和可信度。',
        'work_optimization'
      )

      const rawAchievements = JSON.parse(this.extractJSON(result))
      
      // ISV校验和增强
      const achievements: AchievementItem[] = rawAchievements.map((ach: any, index: number) => {
        const achievement: AchievementItem = {
          id: `work-${Date.now()}-${index}`,
          source: 'work_achievements',
          timestamp: new Date().toISOString(),
          confidence: ach.metrics.confidence,
          content: ach.content,
          metrics: ach.metrics,
          relevance: ach.relevance,
          freshness: ach.freshness,
          tags: ach.tags
        }

        // ISV校验
        const validation = IndustryStandardValidator.validateMetrics(achievement)
        if (!validation.isValid) {
          achievement.content = IndustryStandardValidator.enhanceDescription(
            achievement.content, 
            achievement.metrics
          )
          achievement.confidence = validation.confidence
          if (validation.suggestedValue) {
            achievement.metrics.value = validation.suggestedValue
          }
        }

        return achievement
      })

      // 发送事件
      this.eventBus.emit('work_achievements.updated', achievements)
      this.monitor.end('work-optimization')
      
      return achievements
    } catch (error) {
      this.monitor.end('work-optimization')
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
    this.monitor.start('project-beautification')
    
    try {
      const prompt = `
美化以下项目经历，生成量化成就：

目标职位：${targetJobTitle}
个人背景：${personalInfo.name}

项目经历：
${projects.map(proj => `
项目：${proj.name}
角色：${proj.role}
时间：${proj.duration}
描述：${proj.description}
技术栈：${proj.technologies}
链接：${proj.link || '无'}
`).join('\n\n')}

按照统一数据契约返回JSON格式的成就列表。
重点突出：
1. 技术创新和解决方案
2. 性能优化和量化指标  
3. 用户价值和业务影响
4. 个人技术贡献

ISV规则：避免夸张，使用可信的量化表述。`

      const result = await this.callAI(
        prompt,
        '你是项目成就提炼专家，擅长将项目经历量化，突出技术价值和业务影响，严格遵循ISV校验标准。',
        'project_beautification'
      )

      const rawAchievements = JSON.parse(this.extractJSON(result))
      
      const achievements: AchievementItem[] = rawAchievements.map((ach: any, index: number) => {
        const achievement: AchievementItem = {
          id: `project-${Date.now()}-${index}`,
          source: 'project_achievements',
          timestamp: new Date().toISOString(),
          confidence: ach.metrics?.confidence || 0.75,
          content: ach.content,
          metrics: ach.metrics || {
            type: 'qualitative',
            value: '显著改进',
            confidence: 0.75
          },
          relevance: ach.relevance || {
            target_job_title: targetJobTitle,
            score: 0.8
          },
          freshness: ach.freshness || new Date().toISOString().slice(0, 7),
          tags: ach.tags || ['项目开发']
        }

        // ISV校验
        const validation = IndustryStandardValidator.validateMetrics(achievement)
        if (!validation.isValid && validation.suggestedValue) {
          achievement.metrics.value = validation.suggestedValue
          achievement.confidence = validation.confidence
        }

        return achievement
      })

      // 发送事件
      this.eventBus.emit('project_achievements.updated', achievements)
      this.monitor.end('project-beautification')
      
      return achievements
    } catch (error) {
      this.monitor.end('project-beautification')
      console.error('项目经历美化失败:', error)
      throw error
    }
  }

  // 通用AI调用方法（供其他组件使用）
  async callAI(prompt: string, systemMessage: string, maxTokens: number = 3000): Promise<string> {
    return this.callAI(prompt, systemMessage, 'general')
  }

  private extractJSON(content: string): string {
    const jsonMatch = content.match(/\[[\s\S]*\]/) || content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return jsonMatch[0]
    }
    return content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  }
}

// 成就融合引擎
class AchievementFusionEngine {
  private isv: typeof IndustryStandardValidator = IndustryStandardValidator

  async fuseAchievements(
    skills: SkillRecommendation[],
    workAchievements: AchievementItem[],
    projectAchievements: AchievementItem[],
    targetJobTitle: string
  ): Promise<AchievementItem[]> {
    console.log('[融合引擎] 开始处理...')
    
    // 1. 标准化输入
    const allAchievements = [...workAchievements, ...projectAchievements]
    
    // 2. 去重/合并（语义相似度检测）
    const deduplicatedAchievements = this.semanticDeduplication(allAchievements)
    
    // 3. 打分排序
    const scoredAchievements = this.scoreAndRank(deduplicatedAchievements, targetJobTitle, skills)
    
    // 4. ISV校验
    const validatedAchievements = scoredAchievements.map(achievement => {
      const validation = this.isv.validateMetrics(achievement)
      if (!validation.isValid) {
        return {
          ...achievement,
          content: this.isv.enhanceDescription(achievement.content, achievement.metrics),
          confidence: validation.confidence
        }
      }
      return achievement
    })
    
    // 5. 裁剪到Top-K（保证多样性）
    const finalAchievements = this.selectTopKWithDiversity(validatedAchievements, 8)
    
    console.log('[融合引擎] 完成，输出', finalAchievements.length, '项成就')
    return finalAchievements
  }

  private semanticDeduplication(achievements: AchievementItem[]): AchievementItem[] {
    const deduped: AchievementItem[] = []
    
    for (const achievement of achievements) {
      const isDuplicate = deduped.some(existing => {
        const similarity = this.calculateSimilarity(achievement.content, existing.content)
        return similarity > 0.85
      })
      
      if (!isDuplicate) {
        deduped.push(achievement)
      }
    }
    
    return deduped
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\W+/)
    const words2 = text2.toLowerCase().split(/\W+/)
    
    const intersection = words1.filter(word => words2.includes(word))
    const union = [...new Set([...words1, ...words2])]
    
    return intersection.length / union.length
  }

  private scoreAndRank(
    achievements: AchievementItem[], 
    targetJobTitle: string,
    skills: SkillRecommendation[]
  ): AchievementItem[] {
    const α = 0.4, β = 0.3, γ = 0.2, δ = 0.1

    return achievements.map(achievement => {
      const relevanceScore = achievement.relevance.score
      const impactScore = this.calculateImpactScore(achievement.metrics)
      const freshnessScore = this.calculateFreshnessScore(achievement.freshness)
      const diversityScore = this.calculateDiversityScore(achievement.tags, skills)
      
      const totalScore = α * relevanceScore + β * impactScore + γ * freshnessScore + δ * diversityScore
      
      return {
        ...achievement,
        rankScore: totalScore
      }
    }).sort((a, b) => (b as any).rankScore - (a as any).rankScore)
  }

  private calculateImpactScore(metrics: AchievementItem['metrics']): number {
    if (metrics.type === 'percentage') {
      const value = parseFloat(metrics.value)
      return Math.min(value / 100, 1.0) * metrics.confidence
    }
    
    if (metrics.type === 'absolute') {
      const numbers = metrics.value.match(/\d+/g)
      if (numbers) {
        const maxNumber = Math.max(...numbers.map(n => parseInt(n)))
        return Math.min(maxNumber / 100, 1.0) * metrics.confidence
      }
    }
    
    return 0.5 * metrics.confidence
  }

  private calculateFreshnessScore(freshness: string): number {
    const achievementDate = new Date(freshness + '-01')
    const now = new Date()
    const monthsAgo = (now.getTime() - achievementDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    
    if (monthsAgo <= 3) return 1.0
    if (monthsAgo <= 12) return 0.8
    if (monthsAgo <= 24) return 0.5
    return 0.2
  }

  private calculateDiversityScore(tags: string[], skills: SkillRecommendation[]): number {
    const skillNames = skills.map(s => s.skill.toLowerCase())
    const tagMatches = tags.filter(tag => skillNames.some(skill => skill.includes(tag.toLowerCase())))
    
    return Math.min(tagMatches.length / tags.length, 1.0)
  }

  private selectTopKWithDiversity(achievements: AchievementItem[], k: number): AchievementItem[] {
    const selected: AchievementItem[] = []
    const usedTags = new Set<string>()
    
    for (const achievement of achievements) {
      if (selected.length >= k) break
      
      const newTags = achievement.tags.filter(tag => !usedTags.has(tag))
      if (newTags.length > 0 || selected.length < k/2) {
        selected.push(achievement)
        achievement.tags.forEach(tag => usedTags.add(tag))
      }
    }
    
    for (const achievement of achievements) {
      if (selected.length >= k) break
      if (!selected.includes(achievement)) {
        selected.push(achievement)
      }
    }
    
    return selected.slice(0, k)
  }
}

// 导出服务实例
export const eventBus = new EventBus()
export const aiService = new AIService(eventBus)
export const achievementFusionEngine = new AchievementFusionEngine()

// 向后兼容的创建函数
export const createAIService = (): AIService => aiService

export { AIService, EventBus, AchievementFusionEngine, IndustryStandardValidator }
export type { SkillRecommendation, AchievementItem, ISVValidationResult }
