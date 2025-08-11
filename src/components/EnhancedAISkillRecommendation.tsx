import React, { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Sparkles, Plus, Edit3, Trash2, RefreshCw, CheckCircle, Circle, Lightbulb, AlertCircle, FileText, Award, Wand2, TrendingUp, Target, Brain, Zap, Save, X, Globe } from 'lucide-react'
import { deduplicateSkills, isSkillDuplicate, mergeAndDeduplicateSkills, clearSkillStorage, generateSessionId } from '../utils/skillUtils'

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

interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description: string
  isInternship?: boolean
  achievements?: string[]
}

interface Skill {
  id: string
  name: string
  level: 'understand' | 'proficient' | 'expert'
  category: string
  description?: string
}

interface AISkillRecommendation {
  name: string
  level: 'understand' | 'proficient' | 'expert'
  category: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  selected: boolean
  salaryImpact?: string
  learningTime?: string
  trend?: 'rising' | 'stable' | 'declining'
  description?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  type: 'education' | 'work' | 'project' | 'other'
  date?: string
  quantifiedImpact?: string
}

interface Language {
  id: string
  name: string
  proficiency: 'native' | 'fluent' | 'intermediate' | 'basic'
  certificate?: string
}

interface IndustryAnalysis {
  trends: string[]
  emergingSkills: string[]
  decliningSkills: string[]
  aiImpact: string
  remoteWorkImpact: string
}

interface EnhancedAISkillRecommendationProps {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  initialSkills: Skill[]
  onComplete: (data: {
    skills: Skill[]
    skillsSummary: string
    achievements: Achievement[]
    languages: Language[]
    industryAnalysis: IndustryAnalysis
  }) => void
  onBack: () => void
}

const EnhancedAISkillRecommendation: React.FC<EnhancedAISkillRecommendationProps> = ({
  personalInfo,
  education,
  experience,
  initialSkills,
  onComplete,
  onBack
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [recommendedSkills, setRecommendedSkills] = useState<AISkillRecommendation[]>([])
  const [customSkills, setCustomSkills] = useState<Skill[]>(initialSkills || [])
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [editingSkillData, setEditingSkillData] = useState<AISkillRecommendation | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState<string | null>(null)
  const [isClearing, setIsClearing] = useState(false)
  
  const [skillsSummary, setSkillsSummary] = useState('')
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [industryAnalysis, setIndustryAnalysis] = useState<IndustryAnalysis | null>(null)
  const [showAnalysisTab, setShowAnalysisTab] = useState('skills')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [isGeneratingAchievements, setIsGeneratingAchievements] = useState(false)
  
  // 新增状态：会话管理
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [skillHistory, setSkillHistory] = useState<AISkillRecommendation[]>([])
  
  // 语言表单状态
  const [showLanguageForm, setShowLanguageForm] = useState(false)
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    proficiency: 'intermediate' as const,
    certificate: ''
  })
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'proficient' as const,
    category: '',
    description: ''
  })

  const levelLabels = {
    understand: '了解',
    proficient: '熟练',
    expert: '精通'
  }

  const levelColors = {
    understand: 'bg-blue-100 text-blue-800',
    proficient: 'bg-green-100 text-green-800',
    expert: 'bg-purple-100 text-purple-800'
  }

  const proficiencyLabels = {
    native: '母语',
    fluent: '流利',
    intermediate: '中级',
    basic: '初级'
  }

  const proficiencyColors = {
    native: 'bg-green-100 text-green-800',
    fluent: 'bg-blue-100 text-blue-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    basic: 'bg-gray-100 text-gray-800'
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  }

  const trendIcons = {
    rising: '📈',
    stable: '➡️',
    declining: '📉'
  }

  // 使用Netlify Functions调用AI
  const callAIService = async (prompt: string, systemMessage: string) => {
    const baseURL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8888/.netlify/functions/ai-service'
      : '/.netlify/functions/ai-service'
    
    try {
      const response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemMessage,
          action: 'general',
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
      console.error('AI调用失败:', error)
      throw error
    }
  }

  // 生成量化成就
  const generateAchievements = async () => {
    setIsGeneratingAchievements(true)
    try {
      const experienceInfo = experience.map(exp => {
        let expText = `${exp.position} @ ${exp.company} (${exp.duration})`
        if (exp.isInternship) {
          expText += ' [实习]'
        }
        expText += `\n描述：${exp.description}`
        
        if (exp.achievements && exp.achievements.length > 0) {
          expText += `\n已有成就：${exp.achievements.join('；')}`
        }
        return expText
      }).join('\n\n')

      const prompt = `
基于以下工作经历信息，为求职者生成量化的职业成就：

个人信息：
- 姓名：${personalInfo.name}
- 目标职位：${personalInfo.title || '未指定'}
- 教育背景：${education.map(edu => `${edu.degree} ${edu.major}`).join('、')}

工作经历详情：
${experienceInfo}

要求生成5-8个量化成就，每个成就必须包含：
1. **具体的数字/百分比/时间等量化指标**
2. **明确的业务价值或影响**
3. **简洁有力的表述（20-40字）**

成就类型应涵盖：
- 业绩提升（销售额、效率、质量等）
- 流程优化（时间节省、成本降低等）
- 团队领导（团队规模、项目管理等）
- 技术创新（系统改进、自动化等）
- 客户服务（满意度、问题解决等）

返回JSON格式：
[
  {
    "title": "业绩提升20%",
    "description": "通过优化销售流程和数据分析，在6个月内将团队业绩提升20%，超额完成季度目标",
    "type": "work",
    "quantifiedImpact": "提升20%业绩，节省30%时间"
  }
]

注意：
- 如果工作经历较少或信息不足，基于教育背景和目标职位推测合理的成就
- 所有成就都必须包含具体数字
- 避免夸大，保持真实可信
- 突出与目标职位相关的能力`

      const systemMessage = '你是资深的简历写作专家，擅长将工作经历转化为量化的职业成就，让HR能够直观看到候选人的价值贡献。'
      
      const content = await callAIService(prompt, systemMessage)
      const newAchievements = parseAchievements(content)
      setAchievements(newAchievements)
    } catch (error) {
      console.error('成就生成失败:', error)
      // 生成备选成就
      const fallbackAchievements: Achievement[] = [
        {
          id: '1',
          title: '效率提升',
          description: '通过流程优化和工具应用，将工作效率提升25%',
          type: 'work',
          quantifiedImpact: '效率提升25%'
        },
        {
          id: '2',
          title: '项目成功',
          description: '成功完成3个重要项目，按时交付率达到100%',
          type: 'work',
          quantifiedImpact: '100%按时交付'
        }
      ]
      setAchievements(fallbackAchievements)
    } finally {
      setIsGeneratingAchievements(false)
    }
  }

  // 解析AI返回的成就
  const parseAchievements = (content: string): Achievement[] => {
    try {
      let jsonString = content.trim()
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        jsonString = jsonMatch[0]
      }
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      
      const achievements = JSON.parse(jsonString)
      
      if (!Array.isArray(achievements)) {
        throw new Error('返回的不是数组格式')
      }

      return achievements.map((achievement: any, index: number) => ({
        id: Date.now().toString() + index,
        title: achievement.title || `成就${index + 1}`,
        description: achievement.description || '重要的职业成就',
        type: ['education', 'work', 'project', 'other'].includes(achievement.type) 
          ? achievement.type 
          : 'work',
        quantifiedImpact: achievement.quantifiedImpact || '显著影响'
      })).slice(0, 8)
      
    } catch (error) {
      console.error('解析成就失败:', error)
      throw error
    }
  }

  // 为单个技能生成AI描述
  const generateSkillDescription = async (skillName: string, level: string, category: string) => {
    setIsGeneratingDescription(skillName)
    try {
      const userBackground = `
个人背景：
- 目标职位：${personalInfo.title || '未指定'}
- 教育背景：${education.map(edu => `${edu.degree} ${edu.major}`).join('、')}
- 工作经历：${experience.map(exp => `${exp.position} @ ${exp.company}`).join('、')}
`

      const prompt = `
基于以下用户背景，为技能"${skillName}"生成一个具体的能力描述：

${userBackground}

技能信息：
- 技能名称：${skillName}
- 熟练程度：${level}（了解/熟练/精通）
- 技能分类：${category}

要求：
1. 30-50字的简洁描述
2. 具体说明用这个技能能做什么
3. 体现熟练程度对应的能力水平
4. 结合用户的职业背景
5. 使用第一人称"能够..."的表述
6. 避免泛泛而谈，要具体实用

示例格式：
"能够使用PowerBI进行数据可视化分析，制作交互式仪表板，支持业务决策和报告呈现"

请直接返回技能描述，不要包含其他内容：`

      const systemMessage = '你是专业的技能分析师，擅长为求职者撰写具体实用的技能能力描述，让HR一眼就能看懂求职者的实际能力水平。'
      
      const description = await callAIService(prompt, systemMessage)
      return description.trim()
    } catch (error) {
      console.error('技能描述生成失败:', error)
      // 返回默认描述
      const levelMap = {
        'understand': '了解',
        'proficient': '熟练',
        'expert': '精通'
      }
      return `${levelMap[level as keyof typeof levelMap]}掌握${skillName}，能够应用于实际工作场景中`
    } finally {
      setIsGeneratingDescription(null)
    }
  }

  // 修复后的AI技能推荐生成函数
  const generateAISkillRecommendations = async (clearHistory: boolean = false) => {
    try {
      setAiError(null)
      
      // 如果需要清空历史，先清空所有相关状态和存储
      if (clearHistory) {
        setRecommendedSkills([])
        setSkillHistory([])
        clearSkillStorage()
        setCurrentSessionId(generateSessionId())
        console.log('清空历史，开始新的推荐会话')
      }
      
      const educationText = education.map(edu => 
        `${edu.degree} ${edu.major} (${edu.school})`
      ).join(', ')

      const experienceText = experience.map(exp => 
        `${exp.position} @ ${exp.company}: ${exp.description}`
      ).join('\n')

      // 获取当前已有的所有技能（用于避免重复推荐）
      const existingSkillsList = [
        ...recommendedSkills.map(s => `${s.name}(${s.category})`),
        ...customSkills.map(s => `${s.name}(${s.category})`)
      ].join(', ')

      const prompt = `
作为世界顶级的职业规划师和技能分析专家，请基于以下信息为求职者推荐技能：

个人背景：
- 姓名：${personalInfo.name}
- 目标职位：${personalInfo.title || '未指定'}
- 个人简介：${personalInfo.summary || '无'}
- 所在地区：${personalInfo.location}

教育背景：
${educationText}

工作经历：
${experienceText}

${existingSkillsList ? `**重要：避免重复推荐**
当前已有技能（请避免重复推荐这些技能）：
${existingSkillsList}
` : ''}

请从以下维度全面分析并推荐12-15项**全新且不重复**的技能：

1. **核心专业技能** - 该领域必备的专业能力
2. **软件工具技能** - 行业相关的专业软件和工具
3. **办公软件技能** - 现代办公必备工具(Excel高级应用、PPT、项目管理等)
4. **数据分析技能** - 数据处理、分析、可视化工具
5. **数字化工具** - 云服务、自动化、AI工具应用
6. **沟通协作技能** - 远程办公、团队协作工具
7. **新兴技术技能** - AI、机器学习、自动化等前沿技术
8. **软技能** - 沟通、领导力、项目管理等

每个技能请包含：
- 推荐理由（为什么这个技能重要）
- 优先级（high/medium/low）
- 薪资影响（对薪资的正面影响）
- 学习时间估计
- 发展趋势（rising/stable/declining）
- 能力描述（30-50字，说明用这个技能能做什么）

要求：
- 前8个技能设置为selected: true
- 根据2024-2025年市场需求调整权重
- 考虑AI和数字化转型趋势
- 包含具体的软件名称
- 体现现代办公数字化需求
- level只能是: understand(了解), proficient(熟练), expert(精通)
- **确保所有推荐的技能都是新的，与已有技能完全不重复**

返回JSON格式：
[
  {
    "name": "Python编程",
    "level": "proficient",
    "category": "编程语言",
    "reason": "数据分析和自动化的核心技能，市场需求极高",
    "priority": "high",
    "selected": true,
    "salaryImpact": "提升20-30%",
    "learningTime": "3-6个月",
    "trend": "rising",
    "description": "能够编写数据分析脚本，自动化处理业务流程，开发简单的Web应用"
  }
]
`

      const systemMessage = `你是世界顶级的HR专家和职业规划师，拥有20年的行业经验。你深度了解各行各业的技能需求变化，特别是AI和数字化转型对技能要求的影响。你需要为求职者提供最前沿、最实用的技能推荐建议，同时严格避免推荐重复的技能。`
      
      const content = await callAIService(prompt, systemMessage)
      const newSkills = parseAISkillRecommendations(content)
      
      // 关键修复：严格去重处理
      const allExistingSkills = [...recommendedSkills, ...customSkills]
      const deduplicatedNewSkills = newSkills.filter(newSkill => 
        !isSkillDuplicate(newSkill, allExistingSkills)
      )
      
      console.log(`AI返回${newSkills.length}个技能，去重后${deduplicatedNewSkills.length}个技能`)
      
      // 根据是否清空历史来决定如何设置技能
      if (clearHistory) {
        // 清空重新生成：直接设置新技能
        setRecommendedSkills(deduplicateSkills(deduplicatedNewSkills))
        setSkillHistory(deduplicatedNewSkills)
      } else {
        // 增量生成：合并现有技能和新技能，然后去重
        const mergedSkills = mergeAndDeduplicateSkills([recommendedSkills, deduplicatedNewSkills])
        setRecommendedSkills(mergedSkills)
        setSkillHistory(prev => deduplicateSkills([...prev, ...deduplicatedNewSkills]))
      }
      
      // 保存到本地存储
      localStorage.setItem('ai-recommended-skills', JSON.stringify(deduplicatedNewSkills))
      localStorage.setItem('skill-session-id', currentSessionId)
      
      console.log('AI技能推荐成功，当前推荐技能总数:', deduplicatedNewSkills.length)
    } catch (error) {
      console.error('AI技能推荐失败:', error)
      setAiError('AI推荐服务暂时不可用，使用智能备选推荐')
      const fallbackSkills = getIntelligentFallbackSkills()
      
      // 备选技能也要去重
      const allExistingSkills = [...recommendedSkills, ...customSkills]
      const deduplicatedFallback = fallbackSkills.filter(skill => 
        !isSkillDuplicate(skill, allExistingSkills)
      )
      
      if (clearHistory) {
        setRecommendedSkills(deduplicatedFallback)
      } else {
        setRecommendedSkills(prev => mergeAndDeduplicateSkills([prev, deduplicatedFallback]))
      }
    }
  }

  // 一键清空所有AI推荐技能
  const clearAllRecommendedSkills = () => {
    if (window.confirm('确定要清空所有AI推荐的技能吗？这不会影响您手动添加的自定义技能。')) {
      setIsClearing(true)
      
      // 清空推荐技能相关状态
      setRecommendedSkills([])
      setSkillHistory([])
      
      // 清空编辑状态
      setEditingSkill(null)
      setEditingSkillData(null)
      
      // 清空本地存储
      clearSkillStorage()
      
      // 生成新的会话ID
      setCurrentSessionId(generateSessionId())
      
      setTimeout(() => {
        setIsClearing(false)
      }, 500)
      
      console.log('已清空所有AI推荐技能')
    }
  }

  // 清空已选择的AI推荐技能
  const clearSelectedRecommendedSkills = () => {
    const selectedCount = recommendedSkills.filter(skill => skill.selected).length
    if (selectedCount === 0) {
      alert('没有已选择的技能需要清空')
      return
    }
    
    if (window.confirm(`确定要清空 ${selectedCount} 个已选择的AI推荐技能吗？`)) {
      const unselectedSkills = recommendedSkills.filter(skill => !skill.selected)
      setRecommendedSkills(unselectedSkills)
      console.log(`已清空${selectedCount}个已选择的技能`)
    }
  }

  // 生成行业分析
  const generateIndustryAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const targetIndustry = personalInfo.title || education[0]?.major || '通用'
      
      const prompt = `
请分析${targetIndustry}行业/职位的技能发展趋势（2024-2025年）：

基于用户背景：
- 目标职位：${personalInfo.title || '未指定'}
- 教育背景：${education.map(edu => edu.major).join(', ')}
- 工作经历：${experience.map(exp => exp.position).join(', ')}

请提供以下分析：

1. **当前行业热门趋势**（5-7个关键趋势）
2. **快速兴起的新兴技能**（3-5个）
3. **正在衰落的技能**（2-3个）
4. **AI对该行业的具体影响**
5. **远程办公对技能要求的改变**

请以JSON格式返回：
{
  "trends": ["趋势1", "趋势2", ...],
  "emergingSkills": ["新兴技能1", "新兴技能2", ...],
  "decliningSkills": ["衰落技能1", "衰落技能2", ...],
  "aiImpact": "AI对该行业的具体影响描述",
  "remoteWorkImpact": "远程办公对技能要求的改变"
}
`

      const response = await callAIService(prompt, '你是行业研究专家和技能趋势分析师，基于最新市场数据进行深度分析')
      const analysis = parseIndustryAnalysis(response)
      setIndustryAnalysis(analysis)
    } catch (error) {
      console.error('行业分析失败:', error)
      setIndustryAnalysis({
        trends: ['数字化转型加速', '远程协作普及', 'AI工具集成', '数据驱动决策', '跨界技能需求'],
        emergingSkills: ['AI工具应用', '数据可视化', '自动化流程'],
        decliningSkills: ['传统办公软件', '单一技能专精'],
        aiImpact: 'AI正在改变工作流程，提高效率，需要学习与AI协作的能力',
        remoteWorkImpact: '远程工作要求更强的数字化技能和自主管理能力'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 解析AI返回的技能推荐
  const parseAISkillRecommendations = (content: string): AISkillRecommendation[] => {
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
        level: ['understand', 'proficient', 'expert'].includes(skill.level) 
          ? skill.level 
          : 'proficient',
        category: skill.category || '通用技能',
        reason: skill.reason || '重要的职场技能',
        priority: ['high', 'medium', 'low'].includes(skill.priority) ? skill.priority : 'medium',
        selected: skill.selected === true || index < 8,
        salaryImpact: skill.salaryImpact || '有助于薪资提升',
        learningTime: skill.learningTime || '1-3个月',
        trend: ['rising', 'stable', 'declining'].includes(skill.trend) ? skill.trend : 'stable',
        description: skill.description || `熟练掌握${skill.name}，能够应用于实际工作场景`
      })).slice(0, 15)
      
    } catch (error) {
      console.error('解析AI返回内容失败:', error)
      throw error
    }
  }

  // 解析行业分析
  const parseIndustryAnalysis = (content: string): IndustryAnalysis => {
    try {
      let jsonString = content.trim()
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonString = jsonMatch[0]
      }
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      
      const analysis = JSON.parse(jsonString)
      return {
        trends: analysis.trends || [],
        emergingSkills: analysis.emergingSkills || [],
        decliningSkills: analysis.decliningSkills || [],
        aiImpact: analysis.aiImpact || '',
        remoteWorkImpact: analysis.remoteWorkImpact || ''
      }
    } catch (error) {
      console.error('解析行业分析失败:', error)
      throw error
    }
  }

  // 智能备选推荐（基于用户背景）
  const getIntelligentFallbackSkills = (): AISkillRecommendation[] => {
    const baseSkills = [
      {
        name: 'Excel高级应用',
        level: 'proficient' as const,
        category: '办公软件',
        reason: '现代办公必备，数据分析基础工具',
        priority: 'high' as const,
        selected: true,
        salaryImpact: '提升15-20%',
        learningTime: '1-2个月',
        trend: 'stable' as const,
        description: '能够使用透视表、高级函数和VBA宏，进行复杂数据分析和报表制作'
      }
    ]
    
    return baseSkills
  }
  const getIntelligentFallbackSkills = (): AISkillRecommendation[] => {
    const baseSkills = [
      {
        name: 'Excel高级应用',
        level: 'proficient' as const,
        category: '办公软件',
        reason: '现代办公必备，数据分析基础工具',
        priority: 'high' as const,
        selected: true,
        salaryImpact: '提升15-20%',
        learningTime: '1-2个月',
        trend: 'stable' as const,
        description: '能够使用透视表、高级函数和VBA宏，进行复杂数据分析和报表制作'
      },
      {
        name: 'PowerPoint专业制作',
        level: 'proficient' as const,
        category: '办公软件',
        reason: '汇报展示必备技能，提升专业形象',
        priority: 'high' as const,
        selected: true,
        salaryImpact: '提升10-15%',
        learningTime: '2-4周',
        trend: 'stable' as const,
        description: '能够制作专业演示文稿，运用动画效果和设计原则，提升汇报效果'
      },
      {
        name: 'Python基础编程',
        level: 'understand' as const,
        category: '编程语言',
        reason: '自动化和数据分析的核心技能',
        priority: 'high' as const,
        selected: true,
        salaryImpact: '提升25-40%',
        learningTime: '3-6个月',
        trend: 'rising' as const,
        description: '能够编写简单脚本进行数据处理和任务自动化，使用pandas进行数据分析'
      },
      {
        name: 'AI工具应用',
        level: 'understand' as const,
        category: '新兴技术',
        reason: 'ChatGPT等AI工具提高工作效率',
        priority: 'high' as const,
        selected: true,
        salaryImpact: '提升20-30%',
        learningTime: '1个月',
        trend: 'rising' as const,
        description: '能够熟练使用ChatGPT、Claude等AI工具辅助工作，提高内容创作和问题解决效率'
      },
      {
        name: '数据可视化',
        level: 'proficient' as const,
        category: '数据分析',
        reason: '将数据转化为洞察的重要能力',
        priority: 'medium' as const,
        selected: true,
        salaryImpact: '提升15-25%',
        learningTime: '2-3个月',
        trend: 'rising' as const,
        description: '能够使用Tableau、PowerBI等工具制作交互式图表，支持数据驱动决策'
      }
    ]
    
    return baseSkills
  }

  // 修复后的生成技能总结函数
  const generateSkillsSummary = async () => {
    const selectedSkills = [...recommendedSkills.filter(s => s.selected), ...customSkills]
    if (selectedSkills.length === 0) {
      alert('请先选择一些技能再生成总结')
      return
    }

    setIsGeneratingSummary(true)
    try {
      const skillNames = selectedSkills.map(s => s.name).join('、')
      const categories = [...new Set(selectedSkills.map(s => s.category))].join('、')
      
      // 整理工作经验信息（包含成就）
      const experienceInfo = experience.map(exp => {
        let expText = `${exp.position}@${exp.company}(${exp.duration})`
        if (exp.isInternship) {
          expText += '[实习]'
        }
        expText += `：${exp.description}`
        
        if (exp.achievements && exp.achievements.length > 0) {
          expText += ` 主要成就：${exp.achievements.join('；')}`
        }
        return expText
      }).join('\n')

      // 分析技能描述中的能力
      const skillCapabilities = selectedSkills
        .filter(s => s.description)
        .map(s => `${s.name}：${s.description}`)
        .join('\n')

      // 统计量化信息
      const quantifiedData = {
        totalSkills: selectedSkills.length,
        techSkills: selectedSkills.filter(s => 
          ['编程语言', '技术工具', '数据分析', '新兴技术'].includes(s.category)
        ).length,
        officeSkills: selectedSkills.filter(s => 
          ['办公软件', '沟通协作'].includes(s.category)
        ).length,
        totalExperience: experience.length,
        internshipCount: experience.filter(e => e.isInternship).length,
        totalAchievements: experience.reduce((sum, exp) => sum + (exp.achievements?.length || 0), 0)
      }

      const prompt = `请为以下求职者撰写一个专业的技能总结，要求结合实际工作经验和量化成就：

个人信息：
- 姓名：${personalInfo.name}
- 目标职位：${personalInfo.title || '未指定'}
- 教育背景：${education.map(edu => `${edu.degree} ${edu.major}`).join('、')}

技能信息：
- 主要技能（${quantifiedData.totalSkills}项）：${skillNames}
- 技能领域：${categories}
- 技术技能：${quantifiedData.techSkills}项，办公技能：${quantifiedData.officeSkills}项

技能能力描述：
${skillCapabilities}

工作经历（${quantifiedData.totalExperience}段，包含${quantifiedData.internshipCount}段实习）：
${experienceInfo}

量化数据：
- 总工作成就：${quantifiedData.totalAchievements}项
- 技能覆盖度：涵盖${categories}等${[...new Set(selectedSkills.map(s => s.category))].length}个专业领域

要求：
1. 200-250字的专业技能总结
2. **必须包含量化数据**：技能数量、工作经历、具体成就等
3. 结合工作经验中的实际应用场景
4. 突出技能的现代化和数字化特点
5. 体现AI时代的适应能力和学习能力
6. 如果有工作成就，要在总结中体现具体的价值贡献
7. 展现技能组合的协同效应
8. 语言简洁专业，适合简历使用
9. 开头要有一个强有力的概括句
10. 体现持续学习和技术敏感度

总结结构建议：
第一句：整体技能概况（包含数量）
第二部分：核心技能应用和价值
第三部分：工作成果和量化成就
第四句：学习能力和发展潜力

请直接返回技能总结文字，不要包含其他内容：`

      const systemMessage = `你是资深的简历写作专家和HR顾问，拥有15年的招聘和人才评估经验。你特别擅长：
1. 将技能和工作经验有机结合，展现候选人的综合实力
2. 运用量化数据增强说服力
3. 突出AI时代的核心竞争力
4. 用简洁有力的语言展现最大价值
你深知什么样的技能总结能让HR眼前一亮并产生面试邀请的冲动。`

      const summary = await callAIService(prompt, systemMessage)
      
      // 如果生成的总结没有量化数据，进行二次优化
      const hasQuantification = /\d+/.test(summary)
      if (!hasQuantification && quantifiedData.totalAchievements > 0) {
        const optimizationPrompt = `请优化以下技能总结，确保包含更多量化信息：

当前总结：${summary}

可用的量化数据：
- 掌握${quantifiedData.totalSkills}项专业技能
- ${quantifiedData.totalExperience}段工作经历
- ${quantifiedData.totalAchievements}项具体成就
- 涵盖${[...new Set(selectedSkills.map(s => s.category))].length}个技能领域

要求：将这些数字自然地融入总结中，使其更有说服力。保持200-250字。

请直接返回优化后的总结：`

        try {
          const optimizedSummary = await callAIService(optimizationPrompt, systemMessage)
          setSkillsSummary(optimizedSummary.trim())
        } catch (error) {
          setSkillsSummary(summary.trim())
        }
      } else {
        setSkillsSummary(summary.trim())
      }

    } catch (error) {
      console.error('技能总结生成失败:', error)
      
      // 生成智能备选总结
      const fallbackSummary = generateIntelligentFallbackSummary(selectedSkills, experience, {
        totalSkills: selectedSkills.length,
        techSkills: selectedSkills.filter(s => 
          ['编程语言', '技术工具', '数据分析', '新兴技术'].includes(s.category)
        ).length,
        officeSkills: selectedSkills.filter(s => 
          ['办公软件', '沟通协作'].includes(s.category)
        ).length,
        totalExperience: experience.length,
        internshipCount: experience.filter(e => e.isInternship).length,
        totalAchievements: experience.reduce((sum, exp) => sum + (exp.achievements?.length || 0), 0)
      })
      setSkillsSummary(fallbackSummary)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  // 智能备选总结生成函数
  const generateIntelligentFallbackSummary = (skills: any[], experiences: Experience[], quantData: any) => {
    const skillNames = skills.map(s => s.name).slice(0, 6).join('、')
    const categories = [...new Set(skills.map(s => s.category))].join('、')
    
    let summary = `本人掌握${quantData.totalSkills}项专业技能，涵盖${categories}等现代化技能领域。`
    
    if (quantData.techSkills > 0) {
      summary += `精通${skillNames}等核心技术，`
    }
    
    if (quantData.totalExperience > 0) {
      summary += `拥有${quantData.totalExperience}段${quantData.internshipCount > 0 ? '工作和实习' : '工作'}经历，`
    }
    
    if (quantData.totalAchievements > 0) {
      summary += `累计实现${quantData.totalAchievements}项量化成就。`
    } else {
      summary += '具备扎实的专业基础。'
    }
    
    summary += `能够熟练运用数据分析和自动化技术提升工作效率，具备强大的AI工具应用能力。`
    summary += `适应快速变化的技术环境，持续学习新兴技术，具备优秀的问题解决能力和团队协作精神。`
    
    return summary
  }

  // 语言管理函数
  const handleAddLanguage = () => {
    if (newLanguage.name.trim()) {
      const language: Language = {
        id: Date.now().toString(),
        name: newLanguage.name.trim(),
        proficiency: newLanguage.proficiency,
        certificate: newLanguage.certificate.trim() || undefined
      }
      
      setLanguages(prev => [...prev, language])
      setNewLanguage({ name: '', proficiency: 'intermediate', certificate: '' })
      setShowLanguageForm(false)
    }
  }

  const removeLanguage = (id: string) => {
    setLanguages(prev => prev.filter(lang => lang.id !== id))
  }

  // 组件初始化
  useEffect(() => {
    setIsLoading(true)
    setCurrentSessionId(generateSessionId())
    setTimeout(async () => {
      await Promise.all([
        generateAISkillRecommendations(true), // 初始化时清空历史
        generateIndustryAnalysis(),
        generateAchievements() // 生成工作成就
      ])
      setIsLoading(false)
    }, 2000)
  }, [education, experience])

  const toggleSkillSelection = (index: number) => {
    setRecommendedSkills(prev => prev.map((skill, i) => 
      i === index ? { ...skill, selected: !skill.selected } : skill
    ))
  }

  // 开始编辑技能
  const startEditingSkill = (index: number) => {
    const skill = recommendedSkills[index]
    setEditingSkill(`rec-${index}`)
    setEditingSkillData({...skill})
  }

  // 保存编辑的技能
  const saveEditingSkill = async () => {
    if (!editingSkillData || !editingSkill) return
    
    // 如果技能名称或等级改变，重新生成描述
    const index = parseInt(editingSkill.split('-')[1])
    const originalSkill = recommendedSkills[index]
    
    let newDescription = editingSkillData.description
    
    if (originalSkill.name !== editingSkillData.name || 
        originalSkill.level !== editingSkillData.level ||
        !editingSkillData.description) {
      try {
        newDescription = await generateSkillDescription(
          editingSkillData.name, 
          editingSkillData.level, 
          editingSkillData.category
        )
      } catch (error) {
        console.error('生成技能描述失败:', error)
      }
    }
    
    setRecommendedSkills(prev => prev.map((skill, i) => 
      i === index ? { ...editingSkillData, description: newDescription } : skill
    ))
    
    setEditingSkill(null)
    setEditingSkillData(null)
  }

  // 取消编辑
  const cancelEditingSkill = () => {
    setEditingSkill(null)
    setEditingSkillData(null)
  }

  // 修复：去重后的自定义技能添加
  const handleAddCustomSkill = async () => {
    if (newSkill.name.trim()) {
      // 检查是否与现有技能重复
      const allExistingSkills = [
        ...recommendedSkills.map(s => ({ name: s.name, category: s.category })),
        ...customSkills.map(s => ({ name: s.name, category: s.category }))
      ]
      
      const skillToCheck = { 
        name: newSkill.name.trim(), 
        category: (newSkill.category || '自定义').trim() 
      }
      
      if (isSkillDuplicate(skillToCheck, allExistingSkills)) {
        alert(`技能 "${newSkill.name.trim()}" 在分类 "${skillToCheck.category}" 中已存在，请避免重复添加。`)
        return
      }
      
      let description = newSkill.description
      
      // 如果没有描述，AI自动生成
      if (!description.trim()) {
        try {
          description = await generateSkillDescription(
            newSkill.name.trim(), 
            newSkill.level, 
            skillToCheck.category
          )
        } catch (error) {
          description = `能够运用${newSkill.name.trim()}技能解决实际工作问题`
        }
      }
      
      const customSkill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name.trim(),
        level: newSkill.level,
        category: skillToCheck.category,
        description: description
      }
      
      setCustomSkills(prev => deduplicateSkills([...(prev || []), customSkill]))
      setNewSkill({ name: '', level: 'proficient', category: '', description: '' })
      setShowCustomForm(false)
      
      console.log('添加自定义技能:', customSkill.name)
    }
  }

  // 修复：自定义技能删除函数
  const removeCustomSkill = (id: string) => {
    console.log('删除自定义技能:', id)
    setCustomSkills(prev => (prev || []).filter(skill => skill.id !== id))
  }

  const regenerateRecommendations = async (clearExisting: boolean = true) => {
    setIsRegenerating(true)
    await generateAISkillRecommendations(clearExisting) // 传入清空标志
    setIsRegenerating(false)
  }

  const handleComplete = () => {
    const selectedRecommended = recommendedSkills
      .filter(skill => skill.selected)
      .map((skill, index) => ({
        id: `rec-${index}`,
        name: skill.name,
        level: skill.level,
        category: skill.category,
        description: skill.description || skill.reason
      }))
    
    const allSkills = [...selectedRecommended, ...(customSkills || [])]
    
    onComplete({
      skills: allSkills,
      skillsSummary,
      achievements,
      languages,
      industryAnalysis: industryAnalysis || {
        trends: [],
        emergingSkills: [],
        decliningSkills: [],
        aiImpact: '',
        remoteWorkImpact: ''
      }
    })
  }

  const selectedCount = recommendedSkills.filter(skill => skill.selected).length
  const customSkillsCount = customSkills ? customSkills.length : 0
    if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🧠 AI正在深度分析</h2>
          <div className="space-y-2 text-gray-600">
            <p>✨ 分析您的教育背景</p>
            <p>💼 评估工作经历价值</p>
            <p>📊 研究行业技能趋势</p>
            <p>🎯 生成个性化推荐</p>
            <p>🏆 提取量化成就</p>
            <p>🤖 为每个技能生成详细描述</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回上一步</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">AI智能技能推荐</span>
            </div>
            
            <div className="text-sm text-gray-500">
              已选择 {selectedCount + customSkillsCount} 项技能
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setShowAnalysisTab('skills')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  showAnalysisTab === 'skills'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Zap className="inline h-4 w-4 mr-1" />
                AI技能推荐
              </button>
              <button
                onClick={() => setShowAnalysisTab('achievements')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  showAnalysisTab === 'achievements'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Award className="inline h-4 w-4 mr-1" />
                工作成就
              </button>
              <button
                onClick={() => setShowAnalysisTab('languages')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  showAnalysisTab === 'languages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Globe className="inline h-4 w-4 mr-1" />
                语言能力
              </button>
              <button
                onClick={() => setShowAnalysisTab('analysis')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  showAnalysisTab === 'analysis'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <TrendingUp className="inline h-4 w-4 mr-1" />
                行业分析
              </button>
              <button
                onClick={() => setShowAnalysisTab('summary')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  showAnalysisTab === 'summary'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="inline h-4 w-4 mr-1" />
                技能总结
              </button>
            </nav>
          </div>
        </div>
        {/* 工作成就标签页 */}
        {showAnalysisTab === 'achievements' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    <Award className="inline h-8 w-8 text-orange-500 mr-2" />
                    工作成就（量化展示价值）
                  </h1>
                  <p className="text-gray-600">
                    基于您的工作经历，AI自动提取并生成量化成就，突出您的价值贡献
                  </p>
                </div>
                
                <button
                  onClick={generateAchievements}
                  disabled={isGeneratingAchievements}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isGeneratingAchievements
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  <Wand2 className={`h-4 w-4 ${isGeneratingAchievements ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAchievements ? 'AI分析生成中...' : '重新生成成就'}</span>
                </button>
              </div>

              {achievements.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    {achievements.map((achievement, index) => (
                      <div key={achievement.id} className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{achievement.title}</h3>
                          </div>
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                            {achievement.type === 'work' ? '工作' : achievement.type === 'project' ? '项目' : achievement.type === 'education' ? '教育' : '其他'}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3 leading-relaxed">{achievement.description}</p>
                        
                        {achievement.quantifiedImpact && (
                          <div className="bg-white bg-opacity-50 rounded-lg p-3 border border-orange-200">
                            <p className="text-sm text-orange-800 font-medium">量化影响：{achievement.quantifiedImpact}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 简历写作提示</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• 每个成就都已包含具体的量化数据，可直接用于简历</p>
                      <p>• 建议将这些成就分散放入对应的工作经历中</p>
                      <p>• 使用动词开头的表述方式，突出主动性和成果导向</p>
                      <p>• 在面试时准备详细的背景故事来支撑这些成就</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">还没有生成工作成就</p>
                  <p className="text-sm">点击"重新生成成就"按钮，AI将基于您的工作经历生成量化成就</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 语言能力标签页 */}
        {showAnalysisTab === 'languages' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    <Globe className="inline h-8 w-8 text-green-500 mr-2" />
                    语言能力
                  </h1>
                  <p className="text-gray-600">
                    添加您的语言技能和相关证书，提升简历的国际化竞争力
                  </p>
                </div>
                
                <button
                  onClick={() => setShowLanguageForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>添加语言</span>
                </button>
              </div>

              {showLanguageForm && (
                <div className="mb-6 p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">添加新语言</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">语言名称*</label>
                      <input
                        type="text"
                        value={newLanguage.name}
                        onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="如：英语、日语、德语"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">熟练程度*</label>
                      <select
                        value={newLanguage.proficiency}
                        onChange={(e) => setNewLanguage(prev => ({ ...prev, proficiency: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="basic">初级 (Basic)</option>
                        <option value="intermediate">中级 (Intermediate)</option>
                        <option value="fluent">流利 (Fluent)</option>
                        <option value="native">母语 (Native)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">证书/考试成绩</label>
                      <input
                        type="text"
                        value={newLanguage.certificate}
                        onChange={(e) => setNewLanguage(prev => ({ ...prev, certificate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="如：IELTS 7.5、JLPT N2"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddLanguage}
                      disabled={!newLanguage.name.trim()}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        newLanguage.name.trim()
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      确认添加
                    </button>
                    <button
                      onClick={() => setShowLanguageForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              {languages.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map((language) => (
                      <div key={language.id} className="p-4 border border-gray-200 rounded-lg bg-green-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <Globe className="h-5 w-5 text-green-600" />
                            <span className="font-semibold text-gray-900">{language.name}</span>
                          </div>
                          <button
                            onClick={() => removeLanguage(language.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="删除语言"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${proficiencyColors[language.proficiency]}`}>
                            {proficiencyLabels[language.proficiency]}
                          </span>
                        </div>
                        
                        {language.certificate && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <p className="text-xs text-gray-500 mb-1">证书/成绩：</p>
                            <p className="text-sm text-gray-700 font-medium">{language.certificate}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 简历格式建议</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• <strong>语言名称</strong> - <strong>熟练程度</strong> {languages.some(l => l.certificate) && '- 证书/成绩'}</p>
                      {languages.map((lang, index) => (
                        <p key={index}>• {lang.name} - {proficiencyLabels[lang.proficiency]} {lang.certificate && `- ${lang.certificate}`}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Globe className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">还没有添加语言技能</p>
                  <p className="text-sm">点击"添加语言"按钮开始添加您的语言能力</p>
                  <div className="mt-4 text-xs text-gray-400">
                    <p>支持的熟练程度：母语 > 流利 > 中级 > 初级</p>
                    <p>常见证书：IELTS、TOEFL、JLPT、HSK、德福等</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {showAnalysisTab === 'skills' && (
          <div className="space-y-8">
            {aiError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">AI服务提示</h3>
                  <p className="text-sm text-yellow-700 mt-1">{aiError}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    <Brain className="inline h-8 w-8 text-blue-500 mr-2" />
                    AI智能技能推荐
                  </h1>
                  <p className="text-gray-600">
                    基于您的背景和2024-2025年市场趋势，AI为您精选了以下技能，点击编辑可自定义
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  {/* 一键清空按钮 */}
                  <button
                    onClick={clearAllRecommendedSkills}
                    disabled={isClearing || recommendedSkills.length === 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isClearing || recommendedSkills.length === 0
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <Trash2 className={`h-4 w-4 ${isClearing ? 'animate-pulse' : ''}`} />
                    <span>{isClearing ? '清空中...' : '清空推荐'}</span>
                  </button>
                  
                  {/* 清空已选择 */}
                  <button
                    onClick={clearSelectedRecommendedSkills}
                    disabled={recommendedSkills.filter(s => s.selected).length === 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      recommendedSkills.filter(s => s.selected).length === 0
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    <X className="h-4 w-4" />
                    <span>清空已选</span>
                  </button>
                  
                  {/* 重新推荐按钮 */}
                  <button
                    onClick={() => regenerateRecommendations(true)}
                    disabled={isRegenerating}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isRegenerating
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>{isRegenerating ? 'AI重新分析中...' : '重新推荐'}</span>
                  </button>
                  
                  {/* 增量推荐按钮 */}
                  <button
                    onClick={() => regenerateRecommendations(false)}
                    disabled={isRegenerating}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isRegenerating
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <Plus className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>补充推荐</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendedSkills.map((skill, index) => {
                  const isEditing = editingSkill === `rec-${index}`
                  return (
                    <div
                      key={index}
                      className={`p-5 border-2 rounded-xl transition-all hover:shadow-md ${
                        skill.selected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isEditing ? 'ring-2 ring-purple-500' : ''}`}
                    >
                      {isEditing && editingSkillData ? (
                        // 编辑模式的代码保持不变...
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-purple-700">编辑技能</h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={saveEditingSkill}
                                className="text-green-600 hover:text-green-800"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={cancelEditingSkill}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">技能名称</label>
                              <input
                                type="text"
                                value={editingSkillData.name}
                                onChange={(e) => setEditingSkillData(prev => prev ? {...prev, name: e.target.value} : null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">熟练程度</label>
                                <select
                                  value={editingSkillData.level}
                                  onChange={(e) => setEditingSkillData(prev => prev ? {...prev, level: e.target.value as any} : null)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="understand">了解</option>
                                  <option value="proficient">熟练</option>
                                  <option value="expert">精通</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">技能分类</label>
                                <input
                                  type="text"
                                  value={editingSkillData.category}
                                  onChange={(e) => setEditingSkillData(prev => prev ? {...prev, category: e.target.value} : null)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                能力描述
                                {isGeneratingDescription === editingSkillData.name && (
                                  <span className="ml-2 text-purple-600 text-xs">AI生成中...</span>
                                )}
                              </label>
                              <textarea
                                value={editingSkillData.description || ''}
                                onChange={(e) => setEditingSkillData(prev => prev ? {...prev, description: e.target.value} : null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                rows={3}
                                placeholder="描述您用这个技能能够做什么..."
                              />
                              <button
                                onClick={() => editingSkillData && generateSkillDescription(
                                  editingSkillData.name, 
                                  editingSkillData.level, 
                                  editingSkillData.category
                                ).then(desc => setEditingSkillData(prev => prev ? {...prev, description: desc} : null))}
                                disabled={isGeneratingDescription === editingSkillData.name}
                                className="mt-2 text-sm text-purple-600 hover:text-purple-800 flex items-center"
                              >
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI重新生成描述
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // 显示模式的代码保持不变...
                        <div onClick={() => toggleSkillSelection(index)} className="cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {skill.selected ? (
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                              <span className="font-bold text-gray-900">{skill.name}</span>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${levelColors[skill.level]}`}>
                                {levelLabels[skill.level]}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  startEditingSkill(index)
                                }}
                                className="text-purple-600 hover:text-purple-800"
                                title="编辑技能"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {skill.category}
                            </span>
                            {skill.trend && (
                              <span className="ml-2 text-xs">
                                {trendIcons[skill.trend]} {skill.trend === 'rising' ? '上升趋势' : skill.trend === 'stable' ? '稳定需求' : '下降趋势'}
                              </span>
                            )}
                          </div>
                          
                          {/* 技能描述 */}
                          {skill.description && (
                            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700 font-medium mb-1">能力描述：</p>
                              <p className="text-sm text-gray-600 leading-relaxed">{skill.description}</p>
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-700 mb-3 leading-relaxed">{skill.reason}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-center">
                              <span>💰 {skill.salaryImpact}</span>
                            </div>
                            <div className="flex items-center">
                              <span>⏱️ {skill.learningTime}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 修复后的自定义技能部分 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">自定义技能</h2>
                <button
                  onClick={() => setShowCustomForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>添加技能</span>
                </button>
              </div>

              {showCustomForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">技能名称</label>
                      <input
                        type="text"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="如：PowerFactory"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">掌握程度</label>
                      <select
                        value={newSkill.level}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="understand">了解</option>
                        <option value="proficient">熟练</option>
                        <option value="expert">精通</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">技能分类</label>
                      <input
                        type="text"
                        value={newSkill.category}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="如：专业软件"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        技能描述 
                        <span className="text-gray-500 text-xs">(留空将AI自动生成)</span>
                      </label>
                      <input
                        type="text"
                        value={newSkill.description}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="如：能够进行电力系统建模和故障分析"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddCustomSkill}
                      disabled={!newSkill.name.trim()}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        newSkill.name.trim()
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      确认添加
                    </button>
                    <button
                      onClick={() => setShowCustomForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              {customSkills && customSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customSkills.map((skill) => (
                    <div key={skill.id} className="p-4 border border-gray-200 rounded-lg bg-green-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-gray-900">{skill.name}</span>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setEditingSkill(editingSkill === skill.id ? null : skill.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {/* 修复：添加事件阻止冒泡和正确的删除处理 */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('点击删除按钮，技能ID:', skill.id)
                              removeCustomSkill(skill.id)
                            }}
                            className="text-red-600 hover:text-red-800"
                            title="删除此技能"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${levelColors[skill.level]}`}>
                          {levelLabels[skill.level]}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {skill.category}
                        </span>
                      </div>
                      
                      {skill.description && (
                        <div className="mt-2 p-2 bg-white rounded border">
                          <p className="text-xs text-gray-500 mb-1">能力描述：</p>
                          <p className="text-sm text-gray-700">{skill.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>还没有添加自定义技能</p>
                  <p className="text-sm">点击上方按钮添加您的专业技能</p>
                </div>
              )}
            </div>
          </div>
        )}
        {showAnalysisTab === 'analysis' && (
          <div className="space-y-8">
            {isAnalyzing ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI正在分析行业趋势</h3>
                <p className="text-gray-600">分析最新市场数据和技能需求...</p>
              </div>
            ) : industryAnalysis ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                    当前行业热门趋势
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {industryAnalysis.trends.map((trend, index) => (
                      <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-gray-900 font-medium">{trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Zap className="h-6 w-6 text-blue-600 mr-2" />
                    快速兴起的新兴技能
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {industryAnalysis.emergingSkills.map((skill, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-600">🚀</span>
                          <span className="text-gray-900 font-medium">{skill}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {industryAnalysis.decliningSkills && industryAnalysis.decliningSkills.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                      正在衰落的技能
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {industryAnalysis.decliningSkills.map((skill, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-red-600">📉</span>
                            <span className="text-gray-900 font-medium">{skill}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Brain className="h-6 w-6 text-purple-600 mr-2" />
                    AI对行业的影响
                  </h2>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <p className="text-gray-800 leading-relaxed">{industryAnalysis.aiImpact}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="h-6 w-6 text-orange-600 mr-2" />
                    远程办公的技能要求变化
                  </h2>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <p className="text-gray-800 leading-relaxed">{industryAnalysis.remoteWorkImpact}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">行业分析数据加载中...</p>
              </div>
            )}
          </div>
        )}

        {showAnalysisTab === 'summary' && (
          <div className="space-y-8">
            {/* 数据分析卡片 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                技能数据分析
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {selectedCount + customSkillsCount}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">总技能数</div>
                  <div className="text-xs text-gray-500 mt-1">
                    推荐{selectedCount}项 + 自定义{customSkillsCount}项
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {experience.length}
                  </div>
                  <div className="text-sm text-green-700 font-medium">工作经历</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {experience.filter(e => e.isInternship).length}段实习经历
                  </div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {achievements.length}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">量化成就</div>
                  <div className="text-xs text-gray-500 mt-1">
                    AI生成的成就展示
                  </div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {languages.length}
                  </div>
                  <div className="text-sm text-orange-700 font-medium">语言技能</div>
                  <div className="text-xs text-gray-500 mt-1">
                    多语言竞争力
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">竞争力评估</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>技能现代化程度</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full" 
                          style={{ width: `${Math.min(100, ((recommendedSkills.filter(s => s.selected && s.trend === 'rising').length) / Math.max(selectedCount, 1)) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-blue-600 font-medium">
                        {Math.round(((recommendedSkills.filter(s => s.selected && s.trend === 'rising').length) / Math.max(selectedCount, 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>实践经验丰富度</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ width: `${Math.min(100, experience.length * 25)}%` }}
                        ></div>
                      </div>
                      <span className="text-green-600 font-medium">
                        {Math.min(100, experience.length * 25)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>成就量化程度</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-purple-500 rounded-full" 
                          style={{ width: `${Math.min(100, achievements.length * 15)}%` }}
                        ></div>
                      </div>
                      <span className="text-purple-600 font-medium">
                        {Math.min(100, achievements.length * 15)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>国际化竞争力</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-orange-500 rounded-full" 
                          style={{ width: `${Math.min(100, languages.length * 30)}%` }}
                        ></div>
                      </div>
                      <span className="text-orange-600 font-medium">
                        {Math.min(100, languages.length * 30)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 技能总结区域 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FileText className="h-6 w-6 text-purple-600 mr-2" />
                    AI技能总结
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">基于您的技能、工作经验和量化成就生成专业总结</p>
                </div>
                <button
                  onClick={generateSkillsSummary}
                  disabled={isGeneratingSummary || (selectedCount + customSkillsCount === 0)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isGeneratingSummary || (selectedCount + customSkillsCount === 0)
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  <Wand2 className={`h-4 w-4 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingSummary ? 'AI深度分析生成中...' : 'AI生成增强总结'}</span>
                </button>
              </div>

              {skillsSummary ? (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <textarea
                      value={skillsSummary}
                      onChange={(e) => setSkillsSummary(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={8}
                      placeholder="AI生成的技能总结将显示在这里..."
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-purple-600">💡 您可以编辑上面的内容来完善技能总结</p>
                      <div className="text-xs text-gray-500">
                        字数：{skillsSummary.length} / 建议200-250字
                      </div>
                    </div>
                  </div>
                  
                  {/* 总结质量评估 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">总结质量评估</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${skillsSummary.length >= 200 && skillsSummary.length <= 250 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {skillsSummary.length >= 200 && skillsSummary.length <= 250 ? '✓' : '!'}
                        </div>
                        <div className="text-blue-700">字数适中</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${/\d+/.test(skillsSummary) ? 'text-green-600' : 'text-yellow-600'}`}>
                          {/\d+/.test(skillsSummary) ? '✓' : '!'}
                        </div>
                        <div className="text-blue-700">包含量化</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${[...recommendedSkills.filter(s => s.selected), ...customSkills].some(s => skillsSummary.includes(s.name)) ? 'text-green-600' : 'text-yellow-600'}`}>
                          {[...recommendedSkills.filter(s => s.selected), ...customSkills].some(s => skillsSummary.includes(s.name)) ? '✓' : '!'}
                        </div>
                        <div className="text-blue-700">技能体现</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${achievements.length > 0 || experience.some(e => e.company && skillsSummary.includes(e.company)) || /工作|实习|经历/.test(skillsSummary) ? 'text-green-600' : 'text-yellow-600'}`}>
                          {achievements.length > 0 || experience.some(e => e.company && skillsSummary.includes(e.company)) || /工作|实习|经历/.test(skillsSummary) ? '✓' : '!'}
                        </div>
                        <div className="text-blue-700">经验结合</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">还没有生成技能总结</p>
                  <p className="text-sm">选择技能后点击"AI生成增强总结"按钮</p>
                  <p className="text-xs text-gray-400 mt-2">
                    新版本将结合您的工作经验、量化成就和语言能力生成更有说服力的总结
                  </p>
                </div>
              )}
            </div>
            
            {(selectedCount > 0 || customSkillsCount > 0) && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">已选择的技能预览</h3>
                <div className="grid grid-cols-1 gap-4">
                  {recommendedSkills.filter(skill => skill.selected).map((skill, index) => (
                    <div key={`rec-${index}`} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{skill.name}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${levelColors[skill.level]}`}>
                            {levelLabels[skill.level]}
                          </span>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">{skill.category}</span>
                        </div>
                        <span className="text-xs text-gray-500">{trendIcons[skill.trend || 'stable']}</span>
                      </div>
                      {skill.description && (
                        <p className="text-sm text-gray-700 mt-2">{skill.description}</p>
                      )}
                    </div>
                  ))}
                  {customSkills.map((skill) => (
                    <div key={skill.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${levelColors[skill.level]}`}>
                          {levelLabels[skill.level]}
                        </span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">{skill.category}</span>
                      </div>
                      {skill.description && (
                        <p className="text-sm text-gray-700 mt-2">{skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {(selectedCount > 0 || customSkillsCount > 0 || achievements.length > 0 || languages.length > 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 简历内容完成情况</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedCount + customSkillsCount}</div>
                <div className="text-sm text-gray-600">专业技能</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{achievements.length}</div>
                <div className="text-sm text-gray-600">量化成就</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{languages.length}</div>
                <div className="text-sm text-gray-600">语言技能</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{skillsSummary ? '1' : '0'}</div>
                <div className="text-sm text-gray-600">AI技能总结</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {recommendedSkills.filter(s => s.priority === 'high' && s.selected).length}
                </div>
                <div className="text-sm text-gray-600">高优先级技能</div>
              </div>
            </div>
            <p className="text-blue-800 text-sm">
              🎉 恭喜！您的简历内容已经非常丰富了。包含专业技能、量化成就、语言能力等关键要素，将大大提升简历的竞争力！
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回上一步</span>
          </button>

          <button
            onClick={handleComplete}
            disabled={selectedCount + customSkillsCount === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              selectedCount + customSkillsCount > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>完成并生成简历</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  )
}

export default EnhancedAISkillRecommendation
