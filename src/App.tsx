import React, { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import InformationCollection from './components/InformationCollection'
import EnhancedAISkillRecommendation from './components/EnhancedAISkillRecommendation'
import ResumeEditor from './components/ResumeEditor'
import AdvancedTemplateSelector from './components/AdvancedTemplateSelector'
import SharePage from './components/SharePage'
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage'
import { FileText, Save, RefreshCw, Home } from 'lucide-react'
import SupabaseTest from './components/SupabaseTest'

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

// 工作经验接口
export interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description: string
  isInternship?: boolean
  achievements?: string[]
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

// 更新技能接口
export interface Skill {
  id: string
  name: string
  level: 'understand' | 'proficient' | 'expert'
  category: string
  description?: string
  capabilities?: string[] // 新增：具体能力描述
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

// 语言接口
export interface Language {
  id: string
  name: string
  level: string
  description?: string
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
  experience: Experience[] // 工作经验
  projects: Project[]
  skills: Skill[]
  certificates: Certificate[]
  achievements: Achievement[]
  languages: Language[] // 新增语言字段
  skillsSummary?: string
  industryAnalysis?: IndustryAnalysis
}

// 统一使用标准模板
export type TemplateType = 'standard'

type Step = 'landing' | 'collection' | 'skills' | 'template' | 'resume'

// 环境变量调试组件
const EnvDebugPanel = () => {
  const [showDebug, setShowDebug] = useState(false) // 默认关闭
  
  // 获取所有环境变量
  const envInfo = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'NOT_SET',
    hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    appUrl: import.meta.env.VITE_APP_URL || 'NOT_SET',
    mode: import.meta.env.MODE,
    isProd: import.meta.env.PROD,
    isDev: import.meta.env.DEV,
    baseUrl: import.meta.env.BASE_URL
  }
  
  // 检查环境变量状态
  const hasEnvVars = envInfo.supabaseUrl !== 'NOT_SET' && envInfo.hasSupabaseKey
  
  // 在控制台打印详细信息
  useEffect(() => {
    console.log('=== 环境变量调试信息 ===')
    console.log('Supabase URL:', envInfo.supabaseUrl)
    console.log('Has Supabase Key:', envInfo.hasSupabaseKey)
    console.log('App URL:', envInfo.appUrl)
    console.log('Mode:', envInfo.mode)
    console.log('Is Production:', envInfo.isProd)
    console.log('Is Development:', envInfo.isDev)
    console.log('All VITE vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')))
    console.log('========================')
  }, [])
  
  if (!showDebug) {
    return null // 完全隐藏，不显示按钮
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: '320px',
      background: 'white',
      border: `2px solid ${hasEnvVars ? '#10b981' : '#ef4444'}`,
      borderRadius: '8px',
      padding: '12px',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          🔧 环境变量调试
        </h3>
        <button
          onClick={() => setShowDebug(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#6b7280'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ display: 'grid', gap: '6px' }}>
        <div style={{ 
          padding: '6px',
          background: hasEnvVars ? '#d1fae5' : '#fee2e2',
          borderRadius: '4px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: hasEnvVars ? '#065f46' : '#991b1b'
        }}>
          状态: {hasEnvVars ? '✅ 已配置' : '❌ 未配置'}
        </div>
        
        <div style={{ display: 'grid', gap: '4px', marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280' }}>SUPABASE_URL:</span>
            <span style={{ 
              color: envInfo.supabaseUrl !== 'NOT_SET' ? '#10b981' : '#ef4444',
              fontWeight: 'bold'
            }}>
              {envInfo.supabaseUrl !== 'NOT_SET' ? '已设置' : '未设置'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280' }}>SUPABASE_KEY:</span>
            <span style={{ 
              color: envInfo.hasSupabaseKey ? '#10b981' : '#ef4444',
              fontWeight: 'bold'
            }}>
              {envInfo.hasSupabaseKey ? '已设置' : '未设置'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280' }}>APP_URL:</span>
            <span style={{ 
              color: envInfo.appUrl !== 'NOT_SET' ? '#10b981' : '#ef4444',
              fontWeight: 'bold'
            }}>
              {envInfo.appUrl !== 'NOT_SET' ? '已设置' : '未设置'}
            </span>
          </div>
          
          <div style={{ 
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>环境:</span>
              <span>{envInfo.mode}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>生产模式:</span>
              <span>{envInfo.isProd ? '是' : '否'}</span>
            </div>
          </div>
        </div>
        
        {envInfo.supabaseUrl !== 'NOT_SET' && (
          <div style={{
            marginTop: '8px',
            padding: '6px',
            background: '#f3f4f6',
            borderRadius: '4px',
            fontSize: '10px',
            wordBreak: 'break-all'
          }}>
            URL: {envInfo.supabaseUrl.substring(0, 30)}...
          </div>
        )}
        
        {!hasEnvVars && (
          <div style={{
            marginTop: '8px',
            padding: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#7f1d1d'
          }}>
            ⚠️ 请在 Netlify 后台配置环境变量，然后重新部署
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  // 检查是否是分享链接
  const isShareLink = window.location.pathname.startsWith('/share/')
  
  // 如果是分享链接，显示分享页面
  if (isShareLink) {
    return <SharePage />
  }

  const [currentStep, setCurrentStep] = useState<Step>('landing')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('standard')
  
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
    experience: [], // 工作经验
    projects: [],
    skills: [],
    certificates: [],
    achievements: [],
    languages: [], // 新增语言数组
    skillsSummary: '',
    industryAnalysis: undefined
  })

  // 加载本地存储的数据
  useEffect(() => {
    const savedData = loadFromLocalStorage('resumeData')
    if (savedData) {
      setResumeData({
        ...savedData,
        experience: savedData.experience || [],
        languages: savedData.languages || [], // 确保语言数据被加载
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

  // 处理信息收集完成（包括个人信息、教育、工作经验、项目、语言）
  const handleCollectionComplete = (data: {
    personalInfo: PersonalInfo
    education: Education[]
    experience: Experience[]
    projects: Project[]
    languages: Language[] // 新增
  }) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: data.personalInfo,
      education: data.education,
      experience: data.experience,
      projects: data.projects,
      languages: data.languages // 新增
    }))
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

  // 处理模板选择 - 直接跳到简历生成
  const handleTemplateSelect = (template: TemplateType) => {
    setSelectedTemplate('standard') // 强制使用标准模板
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
        experience: [],
        projects: [],
        skills: [],
        certificates: [],
        achievements: [],
        languages: [], // 重置语言数据
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
        <LandingPage onGetStarted={() => goToStep('collection')} />
  )
      
      case 'collection':
        return (
          <InformationCollection
            initialData={{
              personalInfo: resumeData.personalInfo,
              education: resumeData.education,
              experience: resumeData.experience,
              projects: resumeData.projects,
              languages: resumeData.languages // 新增
            }}
            onComplete={handleCollectionComplete}
            onBack={() => goToStep('landing')}
          />
        )
      
      case 'skills':
        return (
          <EnhancedAISkillRecommendation
            personalInfo={resumeData.personalInfo}
            education={resumeData.education}
            experience={resumeData.experience}
            initialSkills={resumeData.skills}
            onComplete={handleSkillsComplete}
            onBack={() => goToStep('collection')}
          />
        )
      
      case 'template':
        return (
          <AdvancedTemplateSelector
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
      { key: 'collection', label: '信息收集' },
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
      {/* 环境变量调试面板 - 默认关闭 */}
      <EnvDebugPanel />
      {/* 移除 SupabaseTest 组件 */}
    </div>
  )
}

export default App
