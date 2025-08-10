import React, { useState, useEffect } from 'react'
import PersonalInfoForm from './components/PersonalInfoForm'
import EducationForm from './components/EducationForm'
import WorkExperienceForm from './components/WorkExperienceForm'
import ProjectForm from './components/ProjectForm'
import EnhancedAISkillRecommendation from './components/EnhancedAISkillRecommendation'
import ResumeEditor from './components/ResumeEditor'
import TemplateSelector from './components/TemplateSelector'
import LandingPage from './components/LandingPage'
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage'
import { FileText, Save, RefreshCw, Home } from 'lucide-react'

// 定义数据类型
export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  title?: string
  summary?: string
  website?: string
}

export interface Education {
  id: string
  school: string
  degree: string
  major: string
  duration: string
  description: string
  gpa?: string
}

// 更新工作经验接口 - 包含必填和选填字段
export interface WorkExperience {
  id: string
  company: string
  position: string
  duration: string
  description: string
  isInternship?: boolean // 是否为实习
  achievements?: string[] // 工作成就
}

export interface Project {
  id: string
  name: string
  role: string
  duration: string
  description: string
  technologies: string
  link?: string
}

// 更新技能接口 - 添加具体能力描述
export interface Skill {
  id: string
  name: string
  level: 'familiar' | 'proficient' | 'expert' // 改为：熟悉、熟练、精通
  category: string
  description?: string // 原有描述
  capabilities?: string[] // 新增：具体能做什么
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  date: string
  link?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  type: 'education' | 'work' | 'project' | 'other'
  date?: string
}

export interface IndustryAnalysis {
  trends: string[]
  emergingSkills: string[]
  decliningSkills: string[]
  aiImpact: string
  remoteWorkImpact: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education[]
  workExperience: WorkExperience[] // 新增
  projects: Project[]
  skills: Skill[]
  certificates: Certificate[]
  achievements: Achievement[]
  skillsSummary?: string
  industryAnalysis?: IndustryAnalysis
}

export type TemplateType = 
  | 'modern' 
  | 'classic' 
  | 'azurill' 
  | 'bronzor' 
  | 'europass'
  | 'creative-duotone'
  | 'europass-lite'
  | 'flat-infographic'
  | 'fresh-green'
  | 'magazine-style'
  | 'minimal-business'
  | 'modern-card'
  | 'tech-blue'
  | 'academic-cv'
  | 'black-gold'

type Step = 'landing' | 'personal' | 'education' | 'work' | 'projects' | 'skills' | 'template' | 'resume'

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('landing')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern')
  
  // 初始化简历数据
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: '',
      website: ''
    },
    education: [],
    workExperience: [], // 新增
    projects: [],
    skills: [],
    certificates: [],
    achievements: [],
    skillsSummary: '',
    industryAnalysis: undefined
  })

  // 加载本地存储的数据
  useEffect(() => {
    const savedData = loadFromLocalStorage('resumeData')
    if (savedData) {
      // 确保旧数据兼容新结构
      setResumeData({
        ...savedData,
        workExperience: savedData.workExperience || [],
        personalInfo: {
          ...savedData.personalInfo,
          website: savedData.personalInfo?.website || ''
        }
      })
    }
  }, [])

  // 自动保存到本地存储
  useEffect(() => {
    if (resumeData.personalInfo.name) {
      saveToLocalStorage('resumeData', resumeData)
    }
  }, [resumeData])

  // 步骤导航函数
  const goToStep = (step: Step) => {
    setCurrentStep(step)
    window.scrollTo(0, 0)
  }

  // 更新简历数据的通用函数
  const updateResumeData = <K extends keyof ResumeData>(
    key: K,
    value: ResumeData[K]
  ) => {
    setResumeData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // 处理个人信息提交
  const handlePersonalInfoComplete = (data: PersonalInfo) => {
    updateResumeData('personalInfo', data)
    goToStep('education')
  }

  // 处理教育信息提交
  const handleEducationComplete = (data: Education[]) => {
    updateResumeData('education', data)
    goToStep('work')
  }

  // 处理工作经验提交
  const handleWorkExperienceComplete = (data: WorkExperience[]) => {
    updateResumeData('workExperience', data)
    goToStep('projects')
  }

  // 处理项目经验提交
  const handleProjectComplete = (data: Project[]) => {
    updateResumeData('projects', data)
    goToStep('skills')
  }

  // 处理技能推荐完成
  const handleSkillsComplete = (data: {
    skills: Skill[]
    skillsSummary: string
    achievements: Achievement[]
    industryAnalysis: IndustryAnalysis
  }) => {
    setResumeData(prev => ({
      ...prev,
      skills: data.skills,
      skillsSummary: data.skillsSummary,
      achievements: data.achievements,
      industryAnalysis: data.industryAnalysis
    }))
    goToStep('template')
  }

  // 处理模板选择
  const handleTemplateSelect = (template: TemplateType) => {
    setSelectedTemplate(template)
    goToStep('resume')
  }

  // 重置所有数据
  const resetAllData = () => {
    if (window.confirm('确定要重置所有数据吗？这将清除您当前填写的所有信息。')) {
      setResumeData({
        personalInfo: {
          name: '',
          email: '',
          phone: '',
          location: '',
          title: '',
          summary: '',
          website: ''
        },
        education: [],
        workExperience: [],
        projects: [],
        skills: [],
        certificates: [],
        achievements: [],
        skillsSummary: '',
        industryAnalysis: undefined
      })
      setCurrentStep('landing')
      localStorage.removeItem('resumeData')
    }
  }

  // 渲染当前步骤的内容
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return (
          <LandingPage onStart={() => goToStep('personal')} />
        )
      
      case 'personal':
        return (
          <PersonalInfoForm
            initialData={resumeData.personalInfo}
            onComplete={handlePersonalInfoComplete}
            onBack={() => goToStep('landing')}
          />
        )
      
      case 'education':
        return (
          <EducationForm
            initialData={resumeData.education}
            onComplete={handleEducationComplete}
            onBack={() => goToStep('personal')}
          />
        )
      
      case 'work':
        return (
          <WorkExperienceForm
            initialData={resumeData.workExperience}
            onComplete={handleWorkExperienceComplete}
            onBack={() => goToStep('education')}
          />
        )
      
      case 'projects':
        return (
          <ProjectForm
            initialData={resumeData.projects}
            onComplete={handleProjectComplete}
            onBack={() => goToStep('work')}
          />
        )
      
      case 'skills':
        return (
          <EnhancedAISkillRecommendation
            personalInfo={resumeData.personalInfo}
            education={resumeData.education}
            experience={resumeData.workExperience}
            initialSkills={resumeData.skills}
            onComplete={handleSkillsComplete}
            onBack={() => goToStep('projects')}
          />
        )
      
      case 'template':
        return (
          <TemplateSelector
            resumeData={resumeData}
            onSelectTemplate={handleTemplateSelect}
            onBack={() => goToStep('skills')}
          />
        )
      
      case 'resume':
        return (
          <ResumeEditor
            resumeData={resumeData}
            setResumeData={setResumeData}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
            onBack={() => goToStep('template')}
          />
        )
      
      default:
        return null
    }
  }

  // 步骤指示器组件
  const StepIndicator = () => {
    const steps = [
      { key: 'personal', label: '个人信息' },
      { key: 'education', label: '教育背景' },
      { key: 'work', label: '工作经验' },
      { key: 'projects', label: '项目经历' },
      { key: 'skills', label: '技能推荐' },
      { key: 'template', label: '选择模板' },
      { key: 'resume', label: '生成简历' }
    ]

    const currentStepIndex = steps.findIndex(s => s.key === currentStep)

    if (currentStep === 'landing') return null

    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">智能简历生成器</span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => goToStep('landing')}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="返回首页"
              >
                <Home className="h-5 w-5" />
              </button>
              <button
                onClick={resetAllData}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="重置数据"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={() => saveToLocalStorage('resumeData', resumeData)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="保存进度"
              >
                <Save className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStepIndex
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 text-gray-600">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        index < currentStepIndex
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StepIndicator />
      <main className="flex-1">
        {renderCurrentStep()}
      </main>
    </div>
  )
}

export default App
