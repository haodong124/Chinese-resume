import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, User, GraduationCap, Briefcase, FolderOpen, Plus, Trash2, Edit3, Calendar, Building, Star, Sparkles, Target, TrendingUp, Wand2 } from 'lucide-react'

interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  title?: string
  summary?: string
  website?: string
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

interface Project {
  id: string
  name: string
  role: string
  duration: string
  description: string
  technologies: string
  link?: string
}

interface InformationCollectionProps {
  initialData?: {
    personalInfo: PersonalInfo
    education: Education[]
    experience: Experience[]
    projects: Project[]
  }
  onComplete: (data: {
    personalInfo: PersonalInfo
    education: Education[]
    experience: Experience[]
    projects: Project[]
  }) => void
  onBack: () => void
}

const InformationCollection: React.FC<InformationCollectionProps> = ({
  initialData,
  onComplete,
  onBack
}) => {
  const [currentTab, setCurrentTab] = useState<'personal' | 'education' | 'experience' | 'projects'>('personal')
  
  // 个人信息
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(
    initialData?.personalInfo || {
      name: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: '',
      website: ''
    }
  )

  // 教育背景
  const [education, setEducation] = useState<Education[]>(initialData?.education || [])
  const [currentEducation, setCurrentEducation] = useState<Education>({
    id: '',
    school: '',
    degree: '',
    major: '',
    duration: '',
    description: '',
    gpa: ''
  })

  // 工作经验
  const [experience, setExperience] = useState<Experience[]>(initialData?.experience || [])
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    id: '',
    company: '',
    position: '',
    duration: '',
    description: '',
    isInternship: false,
    achievements: []
  })
  const [currentAchievement, setCurrentAchievement] = useState('')
  const [isGeneratingAchievements, setIsGeneratingAchievements] = useState(false)
  const [isOptimizingDescription, setIsOptimizingDescription] = useState(false)

  // 项目经历
  const [projects, setProjects] = useState<Project[]>(initialData?.projects || [])
  const [currentProject, setCurrentProject] = useState<Project>({
    id: '',
    name: '',
    role: '',
    duration: '',
    description: '',
    technologies: '',
    link: ''
  })

  // 编辑状态
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null)
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)

  // AI服务调用
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
          maxTokens: 2000
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

  // AI生成量化工作成就
  const generateAIAchievements = async () => {
    if (!currentExperience.company || !currentExperience.position || !currentExperience.description) {
      alert('请先填写完整的工作信息（公司、职位、工作描述）')
      return
    }

    setIsGeneratingAchievements(true)
    try {
      const experienceContext = `
职位信息：
- 公司：${currentExperience.company}
- 职位：${currentExperience.position}
- 是否实习：${currentExperience.isInternship ? '是' : '否'}
- 工作时间：${currentExperience.duration}
- 工作描述：${currentExperience.description}

个人背景：
- 目标职位：${personalInfo.title || '未指定'}
- 教育背景：${education.map(edu => `${edu.degree} ${edu.major}`).join('、')}
`

      const prompt = `
基于以下工作经历信息，为求职者生成3-5个量化的工作成就：

${experienceContext}

要求：
1. 每个成就都要有具体的数字或量化指标
2. 体现工作的实际价值和影响力
3. 符合该职位的职责范围
4. 语言简洁有力，适合简历使用
5. 如果是实习经历，成就要符合实习生的能力范围
6. 包含以下类型的成就：
   - 效率提升类（提高XX%效率、节省XX时间）
   - 业绩贡献类（完成XX项目、服务XX客户）
   - 学习成长类（掌握XX技能、获得XX认可）
   - 团队协作类（协助XX团队、支持XX业务）

请以JSON数组格式返回，每个成就一个字符串：
["成就1", "成就2", "成就3", "成就4", "成就5"]

示例格式：
["协助团队完成3个重要项目，项目按时交付率达100%", "通过数据分析优化工作流程，提升部门工作效率15%", "独立负责客户服务工作，客户满意度达98%以上", "快速掌握专业软件操作，获得部门优秀实习生称号"]
`

      const systemMessage = '你是专业的简历写作专家，擅长为求职者撰写量化的工作成就，让HR能够直观地看到候选人的价值贡献。你特别了解不同行业和职位的典型成就模式。'
      
      const content = await callAIService(prompt, systemMessage)
      
      try {
        let jsonString = content.trim()
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          jsonString = jsonMatch[0]
        }
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '')
        
        const achievements = JSON.parse(jsonString)
        
        if (Array.isArray(achievements) && achievements.length > 0) {
          setCurrentExperience(prev => ({
            ...prev,
            achievements: [...(prev.achievements || []), ...achievements]
          }))
        } else {
          throw new Error('AI返回格式不正确')
        }
      } catch (parseError) {
        console.error('解析AI返回内容失败:', parseError)
        // 提供备选成就
        const fallbackAchievements = [
          `在${currentExperience.company}${currentExperience.isInternship ? '实习期间' : '工作期间'}表现优秀，获得团队认可`,
          `熟练掌握${currentExperience.position}相关技能，能够独立完成工作任务`,
          `积极参与团队协作，协助完成多个重要项目`,
          `通过学习和实践，工作效率持续提升`
        ]
        setCurrentExperience(prev => ({
          ...prev,
          achievements: [...(prev.achievements || []), ...fallbackAchievements]
        }))
      }
    } catch (error) {
      console.error('AI生成成就失败:', error)
      alert('AI生成暂时不可用，请手动添加工作成就')
    }
    setIsGeneratingAchievements(false)
  }

  // AI优化工作描述
  const optimizeWorkDescription = async () => {
    if (!currentExperience.description.trim()) {
      alert('请先填写工作描述')
      return
    }

    setIsOptimizingDescription(true)
    try {
      const prompt = `
请优化以下工作描述，使其更专业、更具体、更适合简历：

原始描述：${currentExperience.description}

职位信息：
- 公司：${currentExperience.company}
- 职位：${currentExperience.position}
- 是否实习：${currentExperience.isInternship ? '是' : '否'}

优化要求：
1. 使用专业的职场用词
2. 突出具体的工作内容和责任
3. 体现技能的运用和成果
4. 语言简洁有力，适合简历
5. 80-150字左右
6. 避免空泛的表述，要具体实在

请直接返回优化后的工作描述，不要包含其他内容：`

      const systemMessage = '你是专业的简历优化专家，擅长将普通的工作描述转化为专业、具体、有吸引力的简历内容。'
      
      const optimizedDescription = await callAIService(prompt, systemMessage)
      setCurrentExperience(prev => ({
        ...prev,
        description: optimizedDescription.trim()
      }))
    } catch (error) {
      console.error('优化描述失败:', error)
      alert('AI优化暂时不可用')
    }
    setIsOptimizingDescription(false)
  }

  // 日期选择辅助
  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= currentYear - 20; year--) {
      years.push(year)
    }
    return years
  }

  const months = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月']

  // 添加教育经历
  const handleAddEducation = () => {
    if (currentEducation.school && currentEducation.degree && currentEducation.major) {
      if (editingEducationId) {
        setEducation(prev => prev.map(edu => 
          edu.id === editingEducationId ? { ...currentEducation, id: editingEducationId } : edu
        ))
        setEditingEducationId(null)
      } else {
        setEducation(prev => [...prev, { ...currentEducation, id: Date.now().toString() }])
      }
      setCurrentEducation({
        id: '',
        school: '',
        degree: '',
        major: '',
        duration: '',
        description: '',
        gpa: ''
      })
    }
  }

  // 添加工作经验
  const handleAddExperience = () => {
    if (currentExperience.company && currentExperience.position && currentExperience.duration) {
      if (editingExperienceId) {
        setExperience(prev => prev.map(exp => 
          exp.id === editingExperienceId ? { ...currentExperience, id: editingExperienceId } : exp
        ))
        setEditingExperienceId(null)
      } else {
        setExperience(prev => [...prev, { ...currentExperience, id: Date.now().toString() }])
      }
      setCurrentExperience({
        id: '',
        company: '',
        position: '',
        duration: '',
        description: '',
        isInternship: false,
        achievements: []
      })
      setCurrentAchievement('')
    }
  }

  // 添加工作成就
  const handleAddAchievement = () => {
    if (currentAchievement.trim()) {
      setCurrentExperience(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), currentAchievement.trim()]
      }))
      setCurrentAchievement('')
    }
  }

  // 删除工作成就
  const handleRemoveAchievement = (index: number) => {
    setCurrentExperience(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || []
    }))
  }

  // 添加项目
  const handleAddProject = () => {
    if (currentProject.name && currentProject.role) {
      if (editingProjectId) {
        setProjects(prev => prev.map(proj => 
          proj.id === editingProjectId ? { ...currentProject, id: editingProjectId } : proj
        ))
        setEditingProjectId(null)
      } else {
        setProjects(prev => [...prev, { ...currentProject, id: Date.now().toString() }])
      }
      setCurrentProject({
        id: '',
        name: '',
        role: '',
        duration: '',
        description: '',
        technologies: '',
        link: ''
      })
    }
  }

  // 验证并提交
  const handleSubmit = () => {
    if (!personalInfo.name || !personalInfo.email || !personalInfo.phone) {
      alert('请填写完整的个人信息')
      setCurrentTab('personal')
      return
    }

    onComplete({
      personalInfo,
      education,
      experience,
      projects
    })
  }

  // Tab 内容渲染
  const renderTabContent = () => {
    switch (currentTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <User className="mr-2 h-6 w-6 text-blue-600" />
              个人信息
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="张三"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="zhangsan@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  电话 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="13800138000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所在城市 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="北京"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  求职岗位
                </label>
                <input
                  type="text"
                  value={personalInfo.title}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="前端开发工程师"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  个人网站
                </label>
                <input
                  type="url"
                  value={personalInfo.website}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                个人简介
              </label>
              <textarea
                value={personalInfo.summary}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, summary: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="简要介绍您的职业背景和核心优势..."
              />
            </div>
          </div>
        )

      case 'education':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <GraduationCap className="mr-2 h-6 w-6 text-blue-600" />
              教育背景
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={currentEducation.school}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, school: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="学校名称"
                />
                <input
                  type="text"
                  value={currentEducation.degree}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="学位（如：本科、硕士）"
                />
                <input
                  type="text"
                  value={currentEducation.major}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, major: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="专业"
                />
                <input
                  type="text"
                  value={currentEducation.duration}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, duration: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="时间段（如：2019-2023）"
                />
                <input
                  type="text"
                  value={currentEducation.gpa}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, gpa: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="GPA（选填）"
                />
              </div>
              
              <textarea
                value={currentEducation.description}
                onChange={(e) => setCurrentEducation(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="描述您的学习经历、主要课程、荣誉等..."
              />
              
              <button
                onClick={handleAddEducation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingEducationId ? '更新教育经历' : '添加教育经历'}
              </button>
            </div>

            {education.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">已添加的教育经历</h3>
                {education.map((edu) => (
                  <div key={edu.id} className="bg-gray-50 rounded-lg p-4 flex justify-between">
                    <div>
                      <h4 className="font-semibold">{edu.school}</h4>
                      <p className="text-gray-600">{edu.degree} · {edu.major}</p>
                      <p className="text-sm text-gray-500">{edu.duration}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentEducation(edu)
                          setEditingEducationId(edu.id)
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEducation(prev => prev.filter(e => e.id !== edu.id))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
                工作经历 / 实习经验
              </h2>
              <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                AI智能辅助填写
              </div>
            </div>
            
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      公司名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentExperience.company}
                      onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="如：腾讯科技有限公司"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      职位名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentExperience.position}
                      onChange={(e) => setCurrentExperience(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="如：前端开发工程师"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      工作时间 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentExperience.duration}
                      onChange={(e) => setCurrentExperience(prev => ({ ...prev, duration: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="如：2022年6月 - 2023年3月"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentExperience.isInternship}
                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, isInternship: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">这是一份实习经历</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 工作描述 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">工作描述</h3>
                  <button
                    onClick={optimizeWorkDescription}
                    disabled={!currentExperience.description.trim() || isOptimizingDescription}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      currentExperience.description.trim() && !isOptimizingDescription
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Wand2 className={`h-4 w-4 ${isOptimizingDescription ? 'animate-spin' : ''}`} />
                    <span>{isOptimizingDescription ? 'AI优化中...' : 'AI优化描述'}</span>
                  </button>
                </div>
                
                <textarea
                  value={currentExperience.description}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder={`${currentExperience.isInternship ? '实习' : '工作'}内容与职责描述，如：负责前端页面开发，参与产品需求讨论，使用React技术栈完成多个功能模块...`}
                />
                <p className="text-sm text-gray-500 mt-2">
                  💡 填写后可点击"AI优化描述"让AI帮您优化表达，使描述更专业
                </p>
              </div>

              {/* 工作成就 */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    工作成就（量化展示价值）
                 </h3>
                 <button
                   onClick={generateAIAchievements}
                   disabled={!currentExperience.company || !currentExperience.position || !currentExperience.description || isGeneratingAchievements}
                   className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                     currentExperience.company && currentExperience.position && currentExperience.description && !isGeneratingAchievements
                       ? 'bg-green-600 text-white hover:bg-green-700'
                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                   }`}
                 >
                   <Sparkles className={`h-4 w-4 ${isGeneratingAchievements ? 'animate-spin' : ''}`} />
                   <span>{isGeneratingAchievements ? 'AI生成中...' : 'AI智能生成成就'}</span>
                 </button>
               </div>
               
               <div className="mb-4">
                 <div className="flex gap-2">
                   <input
                     type="text"
                     value={currentAchievement}
                     onChange={(e) => setCurrentAchievement(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                     placeholder="如：协助团队完成5个重要项目，项目按时交付率达100%"
                   />
                   <button
                     onClick={handleAddAchievement}
                     disabled={!currentAchievement.trim()}
                     className={`px-4 py-2 rounded-lg transition-colors ${
                       currentAchievement.trim()
                         ? 'bg-green-600 text-white hover:bg-green-700'
                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
                   >
                     添加
                   </button>
                 </div>
                 <div className="flex items-center mt-2 text-sm text-green-700">
                   <Target className="h-4 w-4 mr-1" />
                   <span>建议包含具体数字：完成X个项目、提升X%效率、服务X位客户等</span>
                 </div>
               </div>
               
               {currentExperience.achievements && currentExperience.achievements.length > 0 && (
                 <div className="space-y-2">
                   <h4 className="font-medium text-gray-900 mb-3">已添加的成就：</h4>
                   {currentExperience.achievements.map((achievement, index) => (
                     <div key={index} className="flex items-start justify-between bg-white p-3 rounded-lg border border-green-200">
                       <div className="flex-1">
                         <div className="flex items-center space-x-2 mb-1">
                           <TrendingUp className="h-4 w-4 text-green-600" />
                           <span className="text-sm font-medium text-green-800">成就 {index + 1}</span>
                         </div>
                         <p className="text-sm text-gray-700">{achievement}</p>
                       </div>
                       <button
                         onClick={() => handleRemoveAchievement(index)}
                         className="text-red-500 hover:text-red-700 ml-2"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                     </div>
                   ))}
                 </div>
               )}
               
               {currentExperience.achievements?.length === 0 && (
                 <div className="text-center py-8 text-gray-500">
                   <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                   <p className="mb-2">还没有添加工作成就</p>
                   <p className="text-sm">点击"AI智能生成成就"或手动添加量化成就</p>
                 </div>
               )}
             </div>

             <div className="flex justify-center">
               <button
                 onClick={handleAddExperience}
                 disabled={!currentExperience.company || !currentExperience.position || !currentExperience.duration}
                 className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                   currentExperience.company && currentExperience.position && currentExperience.duration
                     ? 'bg-blue-600 text-white hover:bg-blue-700'
                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                 }`}
               >
                 {editingExperienceId ? '更新工作经历' : '添加工作经历'}
               </button>
             </div>
           </div>

           {experience.length > 0 && (
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <h3 className="text-xl font-semibold text-gray-900">已添加的工作经历</h3>
                 <div className="text-sm text-gray-500">
                   共 {experience.length} 段经历，其中 {experience.filter(e => e.isInternship).length} 段实习
                 </div>
               </div>
               
               {experience.map((exp) => (
                 <div key={exp.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                   <div className="flex justify-between items-start mb-4">
                     <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                         <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                         {exp.isInternship && (
                           <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                             实习经历
                           </span>
                         )}
                       </div>
                       <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                         <div className="flex items-center">
                           <Building className="h-4 w-4 mr-1" />
                           <span className="font-medium">{exp.company}</span>
                         </div>
                         <div className="flex items-center">
                           <Calendar className="h-4 w-4 mr-1" />
                           <span>{exp.duration}</span>
                         </div>
                       </div>
                       <p className="text-gray-700 mb-4 leading-relaxed">{exp.description}</p>
                       
                       {exp.achievements && exp.achievements.length > 0 && (
                         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                           <h5 className="text-sm font-semibold text-green-900 mb-3 flex items-center">
                             <Award className="h-4 w-4 mr-1" />
                             主要成就 ({exp.achievements.length} 项)
                           </h5>
                           <div className="space-y-2">
                             {exp.achievements.map((achievement, index) => (
                               <div key={index} className="flex items-start space-x-2">
                                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-green-800">{achievement}</span>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>
                     
                     <div className="flex flex-col space-y-2 ml-4">
                       <button
                         onClick={() => {
                           setCurrentExperience(exp)
                           setEditingExperienceId(exp.id)
                         }}
                         className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                         title="编辑经历"
                       >
                         <Edit3 className="h-5 w-5" />
                       </button>
                       <button
                         onClick={() => setExperience(prev => prev.filter(e => e.id !== exp.id))}
                         className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                         title="删除经历"
                       >
                         <Trash2 className="h-5 w-5" />
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>
       )

     case 'projects':
       return (
         <div className="space-y-6">
           <h2 className="text-2xl font-bold text-gray-900 flex items-center">
             <FolderOpen className="mr-2 h-6 w-6 text-blue-600" />
             项目经历
           </h2>
           
           <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input
                 type="text"
                 value={currentProject.name}
                 onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                 placeholder="项目名称 *"
               />
               <input
                 type="text"
                 value={currentProject.role}
                 onChange={(e) => setCurrentProject(prev => ({ ...prev, role: e.target.value }))}
                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                 placeholder="担任角色 *"
               />
               <input
                 type="text"
                 value={currentProject.duration}
                 onChange={(e) => setCurrentProject(prev => ({ ...prev, duration: e.target.value }))}
                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                 placeholder="项目时间"
               />
               <input
                 type="url"
                 value={currentProject.link}
                 onChange={(e) => setCurrentProject(prev => ({ ...prev, link: e.target.value }))}
                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                 placeholder="项目链接（选填）"
               />
             </div>
             
             <textarea
               value={currentProject.description}
               onChange={(e) => setCurrentProject(prev => ({ ...prev, description: e.target.value }))}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
               rows={4}
               placeholder="项目描述"
             />
             
             <input
               type="text"
               value={currentProject.technologies}
               onChange={(e) => setCurrentProject(prev => ({ ...prev, technologies: e.target.value }))}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
               placeholder="技术栈（如：React, Node.js, MongoDB）"
             />
             
             <button
               onClick={handleAddProject}
               disabled={!currentProject.name || !currentProject.role}
               className={`px-4 py-2 rounded-lg ${
                 currentProject.name && currentProject.role
                   ? 'bg-blue-600 text-white hover:bg-blue-700'
                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
               }`}
             >
               {editingProjectId ? '更新项目' : '添加项目'}
             </button>
           </div>

           {projects.length > 0 && (
             <div className="space-y-3">
               <h3 className="font-semibold text-gray-900">已添加的项目</h3>
               {projects.map((project) => (
                 <div key={project.id} className="bg-gray-50 rounded-lg p-4 flex justify-between">
                   <div className="flex-1">
                     <h4 className="font-semibold">{project.name}</h4>
                     <p className="text-gray-600">{project.role} · {project.duration}</p>
                     <p className="text-gray-700 mt-2">{project.description}</p>
                     {project.technologies && (
                       <p className="text-sm text-gray-600 mt-1">
                         <span className="font-medium">技术栈：</span> {project.technologies}
                       </p>
                     )}
                   </div>
                   <div className="flex space-x-2 ml-4">
                     <button
                       onClick={() => {
                         setCurrentProject(project)
                         setEditingProjectId(project.id)
                       }}
                       className="text-blue-600 hover:text-blue-800"
                     >
                       <Edit3 className="h-4 w-4" />
                     </button>
                     <button
                       onClick={() => setProjects(prev => prev.filter(p => p.id !== project.id))}
                       className="text-red-600 hover:text-red-800"
                     >
                       <Trash2 className="h-4 w-4" />
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>
       )

     default:
       return null
   }
 }

 return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
     <div className="max-w-6xl mx-auto">
       <div className="bg-white rounded-2xl shadow-xl">
         {/* Tab Navigation */}
         <div className="border-b border-gray-200">
           <nav className="flex">
             <button
               onClick={() => setCurrentTab('personal')}
               className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                 currentTab === 'personal'
                   ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                   : 'text-gray-600 hover:text-gray-900'
               }`}
             >
               <User className="inline h-5 w-5 mr-2" />
               个人信息
             </button>
             <button
               onClick={() => setCurrentTab('education')}
               className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                 currentTab === 'education'
                   ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                   : 'text-gray-600 hover:text-gray-900'
               }`}
             >
               <GraduationCap className="inline h-5 w-5 mr-2" />
               教育背景
             </button>
             <button
               onClick={() => setCurrentTab('experience')}
               className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                 currentTab === 'experience'
                   ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                   : 'text-gray-600 hover:text-gray-900'
               }`}
             >
               <Briefcase className="inline h-5 w-5 mr-2" />
               工作经历
               {experience.length > 0 && (
                 <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                   {experience.length}
                 </span>
               )}
             </button>
             <button
               onClick={() => setCurrentTab('projects')}
               className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                 currentTab === 'projects'
                   ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                   : 'text-gray-600 hover:text-gray-900'
               }`}
             >
               <FolderOpen className="inline h-5 w-5 mr-2" />
               项目经历
               {projects.length > 0 && (
                 <span className="ml-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                   {projects.length}
                 </span>
               )}
             </button>
           </nav>
         </div>

         {/* Tab Content */}
         <div className="p-8">
           {renderTabContent()}
         </div>

         {/* Navigation Buttons */}
         <div className="flex justify-between items-center px-8 py-6 border-t border-gray-200">
           <button
             onClick={onBack}
             className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
           >
             <ArrowLeft className="h-4 w-4" />
             <span>返回首页</span>
           </button>

           <div className="flex items-center space-x-4">
             <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
               完成情况：
               个人信息 {personalInfo.name ? '✅' : '⏳'} | 
               教育 {education.length > 0 ? `✅(${education.length})` : '⏳'} | 
               工作 {experience.length > 0 ? `✅(${experience.length})` : '⏳'} | 
               项目 {projects.length > 0 ? `✅(${projects.length})` : '⏳'}
             </div>
             
             <button
               onClick={handleSubmit}
               className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium shadow-lg"
             >
               <span>下一步：AI技能推荐</span>
               <ArrowRight className="h-5 w-5" />
             </button>
           </div>
         </div>
       </div>
     </div>
   </div>
 )
}

export default InformationCollection
