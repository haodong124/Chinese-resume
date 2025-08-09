import React, { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Sparkles, Plus, Edit3, Trash2, RefreshCw, CheckCircle, Circle, Lightbulb, AlertCircle, FileText, Award, Wand2, TrendingUp, Target, Brain, Zap } from 'lucide-react'

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
}

interface Achievement {
  id: string
  title: string
  description: string
  type: 'education' | 'work' | 'project' | 'other'
  date?: string
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
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
  
  const [skillsSummary, setSkillsSummary] = useState('')
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [industryAnalysis, setIndustryAnalysis] = useState<IndustryAnalysis | null>(null)
  const [showAnalysisTab, setShowAnalysisTab] = useState('skills')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  
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

  // 生成AI技能推荐
  const generateAISkillRecommendations = async () => {
    try {
      setAiError(null)
      
      const educationText = education.map(edu => 
        `${edu.degree} ${edu.major} (${edu.school})`
      ).join(', ')

      const experienceText = experience.map(exp => 
        `${exp.position} @ ${exp.company}: ${exp.description}`
      ).join('\n')

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

请从以下维度全面分析并推荐12-15项技能：

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

要求：
- 前8个技能设置为selected: true
- 根据2024-2025年市场需求调整权重
- 考虑AI和数字化转型趋势
- 包含具体的软件名称
- 体现现代办公数字化需求
- level只能是: understand(了解), proficient(熟练), expert(精通)

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
    "trend": "rising"
  }
]
`

      const systemMessage = `你是世界顶级的HR专家和职业规划师，拥有20年的行业经验。你深度了解各行各业的技能需求变化，特别是AI和数字化转型对技能要求的影响。你需要为求职者提供最前沿、最实用的技能推荐建议。`
      
      const content = await callAIService(prompt, systemMessage)
      const skills = parseAISkillRecommendations(content)
      setRecommendedSkills(skills)
      console.log('AI技能推荐成功:', skills)
    } catch (error) {
      console.error('AI技能推荐失败:', error)
      setAiError('AI推荐服务暂时不可用，使用智能备选推荐')
      const fallbackSkills = getIntelligentFallbackSkills()
      setRecommendedSkills(fallbackSkills)
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
    }
    setIsAnalyzing(false)
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
        trend: ['rising', 'stable', 'declining'].includes(skill.trend) ? skill.trend : 'stable'
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
    const major = education[0]?.major || ''
    const position = personalInfo.title || ''
    
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
        trend: 'stable' as const
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
        trend: 'stable' as const
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
        trend: 'rising' as const
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
        trend: 'rising' as const
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
        trend: 'rising' as const
      }
    ]
    
    return baseSkills
  }

  // 生成技能总结
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
      
      const prompt = `
请为以下求职者撰写一个专业的技能总结：

个人信息：
- 姓名：${personalInfo.name}
- 目标职位：${personalInfo.title || '未指定'}
- 教育背景：${education.map(edu => `${edu.degree} ${edu.major}`).join('、')}
- 主要技能：${skillNames}
- 技能领域：${categories}

要求：
1. 180-220字的专业技能概述
2. 突出技能的现代化和数字化特点
3. 体现AI时代的技能适应性
4. 展现学习能力和技术敏感度
5. 语言简洁专业，适合简历使用
6. 体现技能组合的协同效应

请直接返回技能总结文字，不要包含其他内容：`

      const systemMessage = '你是专业的简历写作专家，擅长为求职者撰写简洁有力的技能总结，特别理解AI时代的技能要求。'
      const summary = await callAIService(prompt, systemMessage)
      setSkillsSummary(summary.trim())
    } catch (error) {
      console.error('技能总结生成失败:', error)
      const skillNames = selectedSkills.map(s => s.name).join('、')
      const mockSummary = `本人掌握${selectedSkills.length}项专业技能，涵盖${[...new Set(selectedSkills.map(s => s.category))].join('、')}等现代化技能领域。精通${skillNames}，具备强大的数字化办公能力和AI工具应用经验。能够运用数据分析和自动化技术提升工作效率，适应快速变化的技术环境，持续学习新兴技术以保持竞争优势。`
      setSkillsSummary(mockSummary)
    }
    setIsGeneratingSummary(false)
  }

  useEffect(() => {
    setIsLoading(true)
    setTimeout(async () => {
      await Promise.all([
        generateAISkillRecommendations(),
        generateIndustryAnalysis()
      ])
      setIsLoading(false)
    }, 2000)
  }, [education, experience])

  const toggleSkillSelection = (index: number) => {
    setRecommendedSkills(prev => prev.map((skill, i) => 
      i === index ? { ...skill, selected: !skill.selected } : skill
    ))
  }

  const handleAddCustomSkill = () => {
    if (newSkill.name.trim()) {
      const customSkill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name,
        level: newSkill.level,
        category: newSkill.category || '自定义',
        description: newSkill.description
      }
      setCustomSkills(prev => [...(prev || []), customSkill])
      setNewSkill({ name: '', level: 'proficient', category: '', description: '' })
      setShowCustomForm(false)
    }
  }

  const removeCustomSkill = (id: string) => {
    setCustomSkills(prev => (prev || []).filter(skill => skill.id !== id))
  }

  const regenerateRecommendations = async () => {
    setIsRegenerating(true)
    await generateAISkillRecommendations()
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
        description: skill.reason
      }))
    
    const allSkills = [...selectedRecommended, ...(customSkills || [])]
    
    onComplete({
      skills: allSkills,
      skillsSummary,
      achievements,
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
                    基于您的背景和2024-2025年市场趋势，AI为您精选了以下技能
                  </p>
                </div>
                <button
                  onClick={regenerateRecommendations}
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
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendedSkills.map((skill, index) => (
                  <div
                    key={index}
                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      skill.selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleSkillSelection(index)}
                  >
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
                        <span className={`px-2 py-1 rounded text-xs border ${priorityColors[skill.priority]}`}>
                          {skill.priority === 'high' ? '高优先级' : skill.priority === 'medium' ? '中优先级' : '低优先级'}
                        </span>
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
                ))}
              </div>
            </div>

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
                        placeholder="如：TypeScript"
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
                        placeholder="如：编程语言"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">技能描述</label>
                      <input
                        type="text"
                        value={newSkill.description}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="简要描述该技能"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddCustomSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                          <button
                            onClick={() => removeCustomSkill(skill.id)}
                            className="text-red-600 hover:text-red-800"
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
                        <p className="text-sm text-gray-700">{skill.description}</p>
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
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FileText className="h-6 w-6 text-purple-600 mr-2" />
                    AI技能总结
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">基于您选择的技能生成专业的技能概述</p>
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
                  <span>{isGeneratingSummary ? 'AI生成中...' : 'AI生成总结'}</span>
                </button>
              </div>

              {skillsSummary ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <textarea
                    value={skillsSummary}
                    onChange={(e) => setSkillsSummary(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={6}
                    placeholder="AI生成的技能总结将显示在这里..."
                  />
                  <p className="text-sm text-purple-600 mt-3">💡 您可以编辑上面的内容来完善技能总结</p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">还没有生成技能总结</p>
                  <p className="text-sm">选择技能后点击"AI生成总结"按钮</p>
                </div>
              )}
            </div>

            {(selectedCount > 0 || customSkillsCount > 0) && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">已选择的技能</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {recommendedSkills.filter(skill => skill.selected).map((skill, index) => (
                    <div key={`rec-${index}`} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="font-medium text-gray-900 text-sm">{skill.name}</div>
                      <div className="text-xs text-blue-600">{skill.category}</div>
                      <div className="text-xs text-gray-500">{levelLabels[skill.level]}</div>
                      <div className="text-xs text-gray-500">{trendIcons[skill.trend || 'stable']}</div>
                    </div>
                  ))}
                  {customSkills.map((skill) => (
                    <div key={skill.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="font-medium text-gray-900 text-sm">{skill.name}</div>
                      <div className="text-xs text-green-600">{skill.category}</div>
                      <div className="text-xs text-gray-500">{levelLabels[skill.level]}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {(selectedCount > 0 || customSkillsCount > 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 AI分析完成情况</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedCount + customSkillsCount}</div>
                <div className="text-sm text-gray-600">推荐技能</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{skillsSummary ? '1' : '0'}</div>
                <div className="text-sm text-gray-600">AI技能总结</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {recommendedSkills.filter(s => s.priority === 'high' && s.selected).length}
                </div>
                <div className="text-sm text-gray-600">高优先级技能</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {recommendedSkills.filter(s => s.trend === 'rising' && s.selected).length}
                </div>
                <div className="text-sm text-gray-600">上升趋势技能</div>
              </div>
            </div>
            <p className="text-blue-800 text-sm">
              🎉 AI已完成深度分析，为您推荐了最符合市场趋势的技能组合！
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
