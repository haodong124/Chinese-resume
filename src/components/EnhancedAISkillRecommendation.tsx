// ============================================
// src/components/EnhancedAISkillRecommendation.tsx - 完整重写版本
// ============================================

import React, { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Sparkles, Plus, Edit3, Trash2, RefreshCw, CheckCircle, Circle, Lightbulb, AlertCircle, FileText, Award, Wand2, TrendingUp, Target, Brain, Zap, Save, X, Globe } from 'lucide-react'

// 导入新的AI服务架构
import { aiService, achievementFusionEngine, eventBus, type SkillRecommendation, type AchievementItem } from '../utils/aiService'

// 导入现有接口
import type { PersonalInfo, Education, Experience, Project, Achievement, Language, IndustryAnalysis } from '../App'

interface EnhancedAISkillRecommendationProps {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  initialSkills: any[]
  onComplete: (data: {
    skills: any[]
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
  // 核心状态管理
  const [isLoading, setIsLoading] = useState(true)
  const [skillRecommendations, setSkillRecommendations] = useState<SkillRecommendation[]>([])
  const [workAchievements, setWorkAchievements] = useState<AchievementItem[]>([])
  const [projectAchievements, setProjectAchievements] = useState<AchievementItem[]>([])
  const [fusedAchievements, setFusedAchievements] = useState<AchievementItem[]>([])
  const [customSkills, setCustomSkills] = useState<any[]>(initialSkills || [])
  
  // AI服务状态
  const [skillsLoading, setSkillsLoading] = useState(false)
  const [workLoading, setWorkLoading] = useState(false)
  const [projectLoading, setProjectLoading] = useState(false)
  const [fusionLoading, setFusionLoading] = useState(false)
  
  const [aiError, setAiError] = useState<string | null>(null)
  const [showAnalysisTab, setShowAnalysisTab] = useState('skills')
  
  // 编辑状态
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [editingSkillData, setEditingSkillData] = useState<SkillRecommendation | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  
  // 自定义技能表单
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'proficient' as const,
    category: '',
    description: ''
  })

  // 语言管理（保持兼容性）
  const [languages, setLanguages] = useState<Language[]>([])
  const [showLanguageForm, setShowLanguageForm] = useState(false)
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    proficiency: 'intermediate' as const,
    certificate: ''
  })

  // 技能总结和行业分析
  const [skillsSummary, setSkillsSummary] = useState('')
  const [industryAnalysis, setIndustryAnalysis] = useState<IndustryAnalysis | null>(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

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

  // 事件监听器设置
  useEffect(() => {
    const handleSkillsUpdated = (skills: SkillRecommendation[]) => {
      console.log('[事件] 技能推荐更新:', skills.length)
      setSkillRecommendations(skills)
      setSkillsLoading(false)
    }

    const handleWorkAchievementsUpdated = (achievements: AchievementItem[]) => {
      console.log('[事件] 工作成就更新:', achievements.length)
      setWorkAchievements(achievements)
      setWorkLoading(false)
      triggerFusion()
    }

    const handleProjectAchievementsUpdated = (achievements: AchievementItem[]) => {
      console.log('[事件] 项目成就更新:', achievements.length)  
      setProjectAchievements(achievements)
      setProjectLoading(false)
      triggerFusion()
    }

    // 注册事件监听器
    eventBus.on('skills.updated', handleSkillsUpdated)
    eventBus.on('work_achievements.updated', handleWorkAchievementsUpdated)
    eventBus.on('project_achievements.updated', handleProjectAchievementsUpdated)

    return () => {
      eventBus.off('skills.updated', handleSkillsUpdated)
      eventBus.off('work_achievements.updated', handleWorkAchievementsUpdated)
      eventBus.off('project_achievements.updated', handleProjectAchievementsUpdated)
    }
  }, [])

  // 触发成就融合
  const triggerFusion = async () => {
    if (workAchievements.length > 0 || projectAchievements.length > 0) {
      setFusionLoading(true)
      try {
        const fused = await achievementFusionEngine.fuseAchievements(
          skillRecommendations,
          workAchievements, 
          projectAchievements,
          personalInfo.title || '通用职位'
        )
        setFusedAchievements(fused)
      } catch (error) {
        console.error('成就融合失败:', error)
        setAiError('成就融合失败，请稍后重试')
      } finally {
        setFusionLoading(false)
      }
    }
  }

  // 初始化AI服务调用
  useEffect(() => {
    const initializeAIServices = async () => {
      setIsLoading(true)
      setAiError(null)

      try {
        // 并行调用AI服务
        const promises = []
        
        // AI服务1：技能推荐
        if (personalInfo.title && education.length > 0) {
          setSkillsLoading(true)
          promises.push(
            aiService.generateSkillRecommendations(
              personalInfo, 
              education, 
              personalInfo.title
            ).catch(error => {
              console.error('技能推荐服务失败:', error)
              setSkillsLoading(false)
              return []
            })
          )
        }

        // AI服务2：工作经历优化  
        if (experience.length > 0) {
          setWorkLoading(true)
          promises.push(
            aiService.optimizeWorkExperience(
              experience,
              personalInfo.title || '通用职位',
              personalInfo
            ).catch(error => {
              console.error('工作经历优化服务失败:', error)
              setWorkLoading(false)
              return []
            })
          )
        }

        // AI服务3：项目经历美化（从全局获取项目数据）
        const projects = (window as any).projectData || []
        if (projects.length > 0) {
          setProjectLoading(true)
          promises.push(
            aiService.beautifyProjectExperience(
              projects,
              personalInfo.title || '通用职位', 
              personalInfo
            ).catch(error => {
              console.error('项目经历美化服务失败:', error)
              setProjectLoading(false)
              return []
            })
          )
        }

        // 生成行业分析
        setIsAnalyzing(true)
        promises.push(generateIndustryAnalysis().catch(() => null))

        // 等待所有服务完成
        await Promise.allSettled(promises)
        
        setTimeout(() => {
          setIsLoading(false)
          setIsAnalyzing(false)
        }, 2000)

      } catch (error) {
        console.error('AI服务初始化失败:', error)
        setAiError('AI服务初始化失败，使用备选方案')
        setIsLoading(false)
        setIsAnalyzing(false)
      }
    }

    initializeAIServices()
  }, [personalInfo.title, education, experience])

  // 生成行业分析
  const generateIndustryAnalysis = async () => {
    try {
      const targetIndustry = personalInfo.title || education[0]?.major || '通用'
      
      const prompt = `请分析${targetIndustry}行业/职位的技能发展趋势（2024-2025年）：

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
}`

      const response = await aiService.callAI(prompt, '你是行业研究专家和技能趋势分析师，基于最新市场数据进行深度分析')
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

  // 生成技能总结
  const generateSkillsSummary = async () => {
    const selectedSkills = [...skillRecommendations.filter(s => s.selected), ...customSkills]
    if (selectedSkills.length === 0) {
      setAiError('请先选择一些技能再生成总结')
      return
    }

    setIsGeneratingSummary(true)
    try {
      const skillNames = selectedSkills.map(s => s.skill || s.name).join('、')
      
      const prompt = `请为以下求职者撰写一个专业的技能总结：

个人信息：
- 姓名：${personalInfo.name}
- 目标职位：${personalInfo.title || '未指定'}
- 教育背景：${education.map(edu => `${edu.degree} ${edu.major}`).join('、')}

技能信息（${selectedSkills.length}项）：${skillNames}

工作经历（${experience.length}段）：
${experience.map(exp => `${exp.position}@${exp.company}：${exp.description}`).join('\n')}

要求：
1. 200-250字的专业技能总结
2. 必须包含量化数据：技能数量、工作经历等
3. 结合工作经验中的实际应用场景
4. 突出技能的现代化和数字化特点
5. 体现AI时代的适应能力
6. 语言简洁专业，适合简历使用

请直接返回技能总结文字：`

      const summary = await aiService.callAI(prompt, '你是资深的简历写作专家和HR顾问，擅长用量化数据增强说服力，突出AI时代的核心竞争力。')
      setSkillsSummary(summary.trim())
      
    } catch (error) {
      console.error('技能总结生成失败:', error)
      
      // 生成智能备选总结
      const fallbackSummary = `掌握${selectedSkills.length}项专业技能，涵盖现代化技能领域。具备${experience.length}段工作经验，能够熟练运用数据分析和自动化技术提升工作效率，具备强大的AI工具应用能力。适应快速变化的技术环境，持续学习新兴技术，具备优秀的问题解决能力和团队协作精神。`
      setSkillsSummary(fallbackSummary)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  // 重新生成技能推荐
  const regenerateSkills = async () => {
    if (!personalInfo.title) {
      setAiError('请先设置目标职位')
      return
    }

    setSkillsLoading(true)
    setAiError(null)
    
    try {
      await aiService.generateSkillRecommendations(
        personalInfo,
        education,
        personalInfo.title
      )
    } catch (error) {
      setAiError('技能推荐重新生成失败')
    }
  }

  // 切换技能选择状态
  const toggleSkillSelection = (index: number) => {
    setSkillRecommendations(prev => prev.map((skill, i) => 
      i === index ? { ...skill, selected: !skill.selected } : skill
    ))
  }

  // 处理自定义技能添加
  const handleAddCustomSkill = () => {
    if (newSkill.name.trim()) {
      const customSkill = {
        id: Date.now().toString(),
        name: newSkill.name.trim(),
        level: newSkill.level,
        category: newSkill.category || '自定义',
        description: newSkill.description || `熟练掌握${newSkill.name.trim()}`
      }
      
      setCustomSkills(prev => [...(prev || []), customSkill])
      setNewSkill({ name: '', level: 'proficient', category: '', description: '' })
      setShowCustomForm(false)
    }
  }

  // 语言能力处理
  const handleAddLanguage = () => {
    if (newLanguage.name.trim()) {
      const language = {
        id: Date.now().toString(),
        name: newLanguage.name.trim(),
        level: newLanguage.proficiency,
        description: newLanguage.certificate || undefined
      }
      
      setLanguages(prev => [...prev, language])
      setNewLanguage({ name: '', proficiency: 'intermediate', certificate: '' })
      setShowLanguageForm(false)
    }
  }

  // 完成并提交结果
  const handleComplete = () => {
    const selectedSkills = skillRecommendations
      .filter(skill => skill.selected)
      .map(skill => ({
        id: skill.id,
        name: skill.skill,
        level: skill.level,
        category: skill.category,
        description: skill.description || skill.value_proposition
      }))
    
    const allSkills = [...selectedSkills, ...customSkills]
    
    // 转换fusedAchievements为兼容格式
    const compatibleAchievements = fusedAchievements.map(ach => ({
      id: ach.id || Date.now().toString(),
      title: ach.content.slice(0, 30) + '...',
      description: ach.content,
      type: ach.source === 'work_achievements' ? 'work' : 'project' as const,
      date: ach.freshness
    }))
    
    onComplete({
      skills: allSkills,
      skillsSummary: skillsSummary || `掌握${allSkills.length}项专业技能，具备现代化数字技术能力。`,
      achievements: compatibleAchievements,
      languages: languages,
      industryAnalysis: industryAnalysis || {
        trends: [],
        emergingSkills: [],
        decliningSkills: [],
        aiImpact: '',
        remoteWorkImpact: ''
      }
    })
  }

  const selectedCount = skillRecommendations.filter(skill => skill.selected).length
  const customSkillsCount = customSkills ? customSkills.length : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">动态拓扑AI正在深度分析</h2>
          <div className="space-y-2 text-gray-600 text-sm">
            <div className="flex items-center justify-between">
              <span>AI服务1：深度技能推荐</span>
              {skillsLoading ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-green-500">✓</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>AI服务2：工作经历优化</span>
              {workLoading ? (
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-green-500">✓</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>AI服务3：项目经历美化</span>
              {projectLoading ? (
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-green-500">✓</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>成就融合引擎</span>
              {fusionLoading ? (
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-green-500">✓</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>行业分析服务</span>
              {isAnalyzing ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-green-500">✓</span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">基于统一数据契约和ISV校验</p>
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
              <span className="text-lg font-semibold text-gray-900">动态拓扑AI简历生成</span>
            </div>
            
            <div className="text-sm text-gray-500">
              技能 {selectedCount} | 成就 {fusedAchievements.length} | 自定义 {customSkillsCount}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {aiError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">系统提示</h3>
              <p className="text-sm text-yellow-700 mt-1">{aiError}</p>
              <button 
                onClick={() => setAiError(null)}
                className="text-xs text-yellow-600 underline mt-2"
              >
                清除提示
              </button>
            </div>
          </div>
        )}

        {/* Tab导航保持原样，但内容更新 */}
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
                AI技能推荐 ({skillRecommendations.length})
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
                融合成就 ({fusedAchievements.length})
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
                系统状态
              </button>
            </nav>
          </div>
        </div>

        {/* 技能推荐标签页 */}
        {showAnalysisTab === 'skills' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    <Brain className="inline h-8 w-8 text-blue-500 mr-2" />
                    AI服务1：深度技能推荐
                  </h1>
                  <p className="text-gray-600">
                    基于岗位解构和统一数据契约的智能推荐，经过ISV校验
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={regenerateSkills}
                    disabled={skillsLoading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      skillsLoading
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <RefreshCw className={`h-4 w-4 ${skillsLoading ? 'animate-spin' : ''}`} />
                    <span>重新推荐</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {skillRecommendations.map((skill, index) => (
                  <div
                    key={skill.id}
                    onClick={() => toggleSkillSelection(index)}
                    className={`p-5 border-2 rounded-xl transition-all hover:shadow-md cursor-pointer ${
                      skill.selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {skill.selected ? (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="font-bold text-gray-900">{skill.skill}</span>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${levelColors[skill.level]}`}>
                          {levelLabels[skill.level]}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[skill.priority]}`}>
                          {skill.priority === 'high' ? '高优先级' : 
                           skill.priority === 'medium' ? '中优先级' : '低优先级'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {skill.category}
                      </span>
                      {skill.trend && (
                        <span className="ml-2 text-xs">
                          {trendIcons[skill.trend]} {skill.trend === 'rising' ? '上升趋势' : 
                           skill.trend === 'stable' ? '稳定需求' : '下降趋势'}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{skill.description}</p>
                    
                    {skill.value_proposition && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-green-800 font-medium">价值主张：</p>
                        <p className="text-sm text-green-700">{skill.value_proposition}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>💰 {skill.salaryImpact}</div>
                      <div>⏱️ {skill.learningTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 自定义技能部分保持原样 */}
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
                    <input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="技能名称"
                    />
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="understand">了解</option>
                      <option value="proficient">熟练</option>
                      <option value="expert">精通</option>
                    </select>
                    <input
                      type="text"
                      value={newSkill.category}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="技能分类"
                    />
                    <input
                      type="text"
                      value={newSkill.description}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="技能描述"
                    />
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
                        <button
                          onClick={() => setCustomSkills(prev => prev.filter(s => s.id !== skill.id))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* 融合成就标签页 */}
        {showAnalysisTab === 'achievements' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    <Award className="inline h-8 w-8 text-orange-500 mr-2" />
                    成就融合引擎输出
                  </h1>
                  <p className="text-gray-600">
                    经过语义去重、ISV校验和评分排序的高质量成就列表
                  </p>
                </div>
                
                <button
                  onClick={triggerFusion}
                  disabled={fusionLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    fusionLoading
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  <Wand2 className={`h-4 w-4 ${fusionLoading ? 'animate-spin' : ''}`} />
                  <span>手动融合</span>
                </button>
              </div>

              {fusedAchievements.length > 0 ? (
                <div className="space-y-4">
                  {fusedAchievements.map((achievement, index) => (
                    <div key={achievement.id} className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {achievement.content.slice(0, 40)}...
                          </h3>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {achievement.source === 'work_achievements' ? '工作成就' : '项目成就'}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            置信度: {Math.round(achievement.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3 leading-relaxed">{achievement.content}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white bg-opacity-50 rounded-lg p-3 border border-orange-200">
                          <p className="text-sm text-orange-800 font-medium">
                            量化指标：{achievement.metrics.value} ({achievement.metrics.type})
                          </p>
                        </div>
                        
                        <div className="bg-white bg-opacity-50 rounded-lg p-3 border border-orange-200">
                          <p className="text-sm text-orange-800 font-medium">
                            相关性评分：{Math.round(achievement.relevance.score * 100)}%
                          </p>
                        </div>
                        
                        <div className="bg-white bg-opacity-50 rounded-lg p-3 border border-orange-200">
                          <p className="text-sm text-orange-800 font-medium">
                            新鲜度：{achievement.freshness}
                          </p>
                        </div>
                      </div>
                      
                      {achievement.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {achievement.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">等待成就融合</p>
                  <p className="text-sm">需要工作经历或项目经历数据才能生成融合成就</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 系统状态标签页 */}
        {showAnalysisTab === 'summary' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">动态拓扑系统状态</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">AI服务1</h3>
                  <p className="text-2xl font-bold text-blue-600">{skillRecommendations.length}</p>
                  <p className="text-sm text-blue-700">技能推荐</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">AI服务2</h3>
                  <p className="text-2xl font-bold text-green-600">{workAchievements.length}</p>
                  <p className="text-sm text-green-700">工作成就</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">AI服务3</h3>
                  <p className="text-2xl font-bold text-purple-600">{projectAchievements.length}</p>
                  <p className="text-sm text-purple-700">项目成就</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">融合引擎</h3>
                  <p className="text-2xl font-bold text-orange-600">{fusedAchievements.length}</p>
                  <p className="text-sm text-orange-700">融合成就</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">技能总结生成</h3>
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
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-purple-600">您可以编辑上面的内容来完善技能总结</p>
                      <div className="text-xs text-gray-500">
                        字数：{skillsSummary.length}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>还没有生成技能总结</p>
                    <p className="text-sm">选择技能后点击生成按钮</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 完成按钮 */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回上一步</span>
          </button>

          <div className="text-sm text-gray-600">
            技能推荐 {skillRecommendations.length} | 
            融合成就 {fusedAchievements.length} | 
            自定义技能 {customSkills.length}
          </div>

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
