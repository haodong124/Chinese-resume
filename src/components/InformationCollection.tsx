import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, User, GraduationCap, Briefcase, FolderOpen, Plus, Trash2, Edit3, Calendar, Building, Star } from 'lucide-react'

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
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
              工作经历 / 实习经验
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={currentExperience.company}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="公司名称 *"
                />
                <input
                  type="text"
                  value={currentExperience.position}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, position: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="职位名称 *"
                />
                <input
                  type="text"
                  value={currentExperience.duration}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, duration: e.target.value}))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="时间段（如：2022年6月 - 2023年3月）*"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentExperience.isInternship}
                    onChange={(e) => setCurrentExperience(prev => ({ ...prev, isInternship: e.target.checked }))}
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">这是一份实习经历</span>
                </label>
              </div>
              
              <textarea
                value={currentExperience.description}
                onChange={(e) => setCurrentExperience(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="工作内容与成果描述 *"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Star className="inline h-4 w-4 text-yellow-500 mr-1" />
                  工作成就（可选）
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentAchievement}
                    onChange={(e) => setCurrentAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="如：获得优秀实习生称号"
                  />
                  <button
                    onClick={handleAddAchievement}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    添加
                  </button>
                </div>
                
                {currentExperience.achievements && currentExperience.achievements.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {currentExperience.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">• {achievement}</span>
                        <button
                          onClick={() => handleRemoveAchievement(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleAddExperience}
                disabled={!currentExperience.company || !currentExperience.position || !currentExperience.duration}
                className={`px-4 py-2 rounded-lg ${
                  currentExperience.company && currentExperience.position && currentExperience.duration
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {editingExperienceId ? '更新工作经历' : '添加工作经历'}
              </button>
            </div>

            {experience.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">已添加的工作经历</h3>
                {experience.map((exp) => (
                  <div key={exp.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{exp.position}</h4>
                          {exp.isInternship && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">实习</span>
                          )}
                        </div>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600">{exp.duration}</p>
                        <p className="text-gray-700 mt-2">{exp.description}</p>
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">主要成就：</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {exp.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setCurrentExperience(exp)
                            setEditingExperienceId(exp.id)
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setExperience(prev => prev.filter(e => e.id !== exp.id))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
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
      <div className="max-w-5xl mx-auto">
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
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回首页</span>
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                已填写：个人信息 {personalInfo.name ? '✓' : '○'} | 
                教育 {education.length > 0 ? `✓(${education.length})` : '○'} | 
                工作 {experience.length > 0 ? `✓(${experience.length})` : '○'} | 
                项目 {projects.length > 0 ? `✓(${projects.length})` : '○'}
              </span>
              
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span>下一步：AI技能推荐</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InformationCollection
