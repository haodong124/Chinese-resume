import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Download, Printer, FileText, Palette } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// 导入所有模板
import StandardTemplate from './templates/StandardTemplate'
import CleanProfessionalTemplate from './templates/CleanProfessionalTemplate'
import AmericanBusinessTemplate from './templates/AmericanBusinessTemplate'
import CreativeGoldenTemplate from './templates/CreativeGoldenTemplate'
import EuropassStyleTemplate from './templates/EuropassStyleTemplate'

// 导入评价弹窗组件
import FeedbackModal from './FeedbackModal'

// 导入分享解锁组件和服务
import ShareUnlockModal from './ShareUnlockModal'
import { findOrCreateUser, saveResume, checkExportPermission } from '../lib/supabase'

export type TemplateType = 'standard' | 'clean-professional' | 'american-business' | 'creative-golden' | 'europass-style'

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

export interface Experience {
  id: string
  company: string
  position: string
  role?: string
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

export interface Skill {
  id: string
  name: string
  level: 'understand' | 'proficient' | 'expert'
  category: string
  description?: string
  capabilities?: string[]
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
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  certificates: Certificate[]
  skillsSummary?: string
  achievements: Achievement[]
  languages: Language[]
  industryAnalysis?: IndustryAnalysis
}

interface ResumeEditorProps {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
  selectedTemplate: TemplateType
  onTemplateChange: (template: TemplateType) => void
  onBack?: () => void
}

// 模板配置
const TEMPLATE_CONFIG = {
  'standard': {
    name: '标准简历',
    description: '经典排版，智能生成内容，适合大多数行业',
    component: StandardTemplate,
    color: '#3B82F6'
  },
  'clean-professional': {
    name: '简洁专业',
    description: '极简设计，英文标题，适合国际化企业',
    component: CleanProfessionalTemplate,
    color: '#22c55e'
  },
  'american-business': {
    name: '美式商务',
    description: '红色强调，三栏技能布局，适合外企',
    component: AmericanBusinessTemplate,
    color: '#dc2626'
  },
  'creative-golden': {
    name: '创意金色',
    description: '左侧边栏，金色装饰，适合创意岗位',
    component: CreativeGoldenTemplate,
    color: '#d97706'
  },
  'europass-style': {
    name: 'Europass风格',
    description: '欧洲标准格式，时间轴布局，适合学术科研',
    component: EuropassStyleTemplate,
    color: '#4a90e2'
  }
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  setResumeData,
  selectedTemplate,
  onTemplateChange,
  onBack
}) => {
  // 模板选择器状态
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  
  // 评价弹窗状态
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // 分享解锁相关状态
  const [showShareModal, setShowShareModal] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [canExport, setCanExport] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [supabaseEnabled, setSupabaseEnabled] = useState(false)
  const [currentClicks, setCurrentClicks] = useState(0)
  const [requiredClicks, setRequiredClicks] = useState(3)

  // 初始化用户和简历
  const initializeUserAndResume = useCallback(async () => {
    // 如果没有邮箱或正在初始化，跳过
    if (!resumeData.personalInfo.email || isInitializing) {
      console.log('跳过初始化：', !resumeData.personalInfo.email ? '没有邮箱' : '正在初始化')
      return
    }
    
    setIsInitializing(true)
    
    try {
      console.log('开始初始化用户和简历...')
      
      // 创建或获取用户
      const user = await findOrCreateUser(
        resumeData.personalInfo.email,
        resumeData.personalInfo.name,
        resumeData.personalInfo.phone
      )
      
      if (user) {
        console.log('用户已创建/找到:', user.id)
        setSupabaseEnabled(true)
        
        // 保存简历
        const resume = await saveResume(user.id, resumeData, selectedTemplate)
        if (resume) {
          console.log('简历已保存:', resume.id)
          setResumeId(resume.id)
          
          // 检查导出权限
          const permission = await checkExportPermission(resume.id)
          if (permission) {
            setCanExport(permission.canExport)
            setCurrentClicks(permission.currentClicks || 0)
            setRequiredClicks(permission.requiredClicks || 3)
            console.log('导出权限状态:', permission)
          }
        }
      } else {
        // Supabase 不可用，默认允许导出
        console.log('Supabase 不可用，启用默认导出')
        setCanExport(true)
        setSupabaseEnabled(false)
      }
    } catch (error) {
      console.error('初始化失败:', error)
      // 如果初始化失败，默认允许导出
      setCanExport(true)
      setSupabaseEnabled(false)
    } finally {
      setIsInitializing(false)
    }
  }, [resumeData.personalInfo.email, resumeData.personalInfo.name, resumeData.personalInfo.phone, resumeData, selectedTemplate, isInitializing])

  // 组件加载时初始化
  useEffect(() => {
    initializeUserAndResume()
  }, []) // 只在组件挂载时执行一次

  // 当邮箱改变时重新初始化
  useEffect(() => {
    if (resumeData.personalInfo.email) {
      initializeUserAndResume()
    }
  }, [resumeData.personalInfo.email])

  // 定期检查权限状态（当弹窗打开时）
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (showShareModal && resumeId) {
      // 每3秒检查一次权限状态
      interval = setInterval(async () => {
        const permission = await checkExportPermission(resumeId)
        if (permission) {
          setCurrentClicks(permission.currentClicks || 0)
          setCanExport(permission.canExport)
          
          // 如果已解锁，关闭弹窗
          if (permission.canExport) {
            setShowShareModal(false)
            // 显示成功提示
            const successToast = document.createElement('div')
            successToast.innerHTML = '🎉 恭喜！PDF导出已解锁，您现在可以免费导出了！'
            successToast.style.cssText = `
              position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
              background: #10b981; color: white; padding: 16px 24px; border-radius: 8px;
              z-index: 9999; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `
            document.body.appendChild(successToast)
            setTimeout(() => document.body.removeChild(successToast), 5000)
          }
        }
      }, 3000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showShareModal, resumeId])

  // 数据适配器
  const adaptDataForTemplate = (data: ResumeData): ResumeData => {
    const adaptedData: ResumeData = {
      personalInfo: {
        name: data.personalInfo?.name || '',
        email: data.personalInfo?.email || '',
        phone: data.personalInfo?.phone || '',
        location: data.personalInfo?.location || '',
        title: data.personalInfo?.title || '',
        summary: data.personalInfo?.summary || '',
        website: data.personalInfo?.website || ''
      },
      education: data.education || [],
      experience: (data.experience || []).map(exp => ({
        ...exp,
        role: exp.role || exp.position,
        achievements: exp.achievements || []
      })),
      projects: data.projects || [],
      skills: data.skills || [],
      certificates: data.certificates || [],
      skillsSummary: data.skillsSummary || data.personalInfo?.summary || '',
      achievements: data.achievements || [],
      languages: data.languages || [],
      industryAnalysis: data.industryAnalysis
    }

    return adaptedData
  }

  // 渲染选中的模板
  const renderTemplate = () => {
    const adaptedData = adaptDataForTemplate(resumeData)
    const TemplateComponent = TEMPLATE_CONFIG[selectedTemplate].component
    return <TemplateComponent resumeData={adaptedData} isPreview={true} />
  }

  // 处理模板切换
  const handleTemplateChange = (templateType: TemplateType) => {
    onTemplateChange(templateType)
    setShowTemplateSelector(false)
  }

  // 处理评价提交成功
  const handleFeedbackSubmitted = () => {
    setFeedbackSubmitted(true)
    setShowFeedbackModal(false)
  }

  // 实际的PDF导出函数
  const actualExportPDF = async () => {
    const element = document.querySelector('.resume-preview') as HTMLElement
    if (!element) {
      alert('找不到简历预览区域，请刷新页面重试')
      return
    }

    try {
      setIsExporting(true)
      
      const loadingToast = document.createElement('div')
      loadingToast.innerHTML = '正在生成高质量PDF，请稍候...'
      loadingToast.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px;
        z-index: 9999; font-size: 16px;
      `
      document.body.appendChild(loadingToast)

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        logging: false,
        imageTimeout: 0,
        removeContainer: true
      })
      
      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false
      })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width
      
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'MEDIUM')
      } else {
        let position = 0
        const pageHeight = pdfHeight
        
        while (position < imgHeight) {
          if (position > 0) {
            pdf.addPage()
          }
          
          pdf.addImage(
            imgData, 
            'PNG', 
            0, 
            -position, 
            imgWidth, 
            imgHeight,
            undefined,
            'MEDIUM'
          )
          
          position += pageHeight
        }
      }
      
      const templateName = TEMPLATE_CONFIG[selectedTemplate].name
      const fileName = `${resumeData.personalInfo.name || '简历'}_${templateName}_${new Date().toLocaleDateString('zh-CN')}.pdf`
      pdf.save(fileName)
      
      document.body.removeChild(loadingToast)
      
      const successToast = document.createElement('div')
      successToast.innerHTML = '✅ 高质量PDF导出成功！'
      successToast.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #10b981; color: white; padding: 12px 20px; border-radius: 8px;
        z-index: 9999; font-size: 14px;
      `
      document.body.appendChild(successToast)
      setTimeout(() => document.body.removeChild(successToast), 3000)
      
      // PDF导出成功后，延迟3秒弹出评价表单
      setTimeout(() => {
        if (!feedbackSubmitted) {
          setShowFeedbackModal(true)
        }
      }, 3000)
      
    } catch (error) {
      console.error('PDF导出失败:', error)
      
      const loadingToast = document.querySelector('div[style*="正在生成"]')
      if (loadingToast) {
        document.body.removeChild(loadingToast)
      }
      
      const errorToast = document.createElement('div')
      errorToast.innerHTML = '❌ PDF导出失败，请重试'
      errorToast.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #ef4444; color: white; padding: 12px 20px; border-radius: 8px;
        z-index: 9999; font-size: 14px;
      `
      document.body.appendChild(errorToast)
      setTimeout(() => document.body.removeChild(errorToast), 3000)
    } finally {
      setIsExporting(false)
    }
  }

  // 处理导出PDF（检查分享解锁）
  const handleExportPDF = async () => {
    console.log('点击导出，当前状态:', {
      supabaseEnabled,
      canExport,
      resumeId,
      currentClicks,
      requiredClicks
    })
    
    // 如果 Supabase 启用且未解锁，显示分享弹窗
    if (supabaseEnabled && !canExport && resumeId) {
      console.log('需要分享解锁，显示分享弹窗')
      setShowShareModal(true)
      return
    }
    
    // 否则直接导出
    await actualExportPDF()
  }

  // 处理分享解锁成功
  const handleShareUnlocked = () => {
    setCanExport(true)
    setShowShareModal(false)
    // 解锁后自动导出
    actualExportPDF()
  }

  // 手动刷新权限状态
  const refreshPermission = async () => {
    if (resumeId) {
      const permission = await checkExportPermission(resumeId)
      if (permission) {
        setCanExport(permission.canExport)
        setCurrentClicks(permission.currentClicks || 0)
        setRequiredClicks(permission.requiredClicks || 3)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>返回上一步</span>
                </button>
              )}
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">简历编辑器</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 模板选择器 */}
              <div className="relative">
                <button
                  onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                  className="flex items-center space-x-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: TEMPLATE_CONFIG[selectedTemplate].color }}
                  ></div>
                  <Palette className="h-4 w-4" />
                  <span className="text-sm font-medium">{TEMPLATE_CONFIG[selectedTemplate].name}</span>
                  <svg className={`h-4 w-4 transition-transform ${showTemplateSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showTemplateSelector && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">选择简历模板</h3>
                      <p className="text-xs text-gray-600 mt-1">选择最适合您职业的模板风格</p>
                    </div>
                    <div className="p-2 max-h-80 overflow-y-auto">
                      {Object.entries(TEMPLATE_CONFIG).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => handleTemplateChange(key as TemplateType)}
                          className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                            selectedTemplate === key ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex items-center space-x-2 mt-1">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: config.color }}
                              ></div>
                              <div className={`w-3 h-3 rounded-full border-2 ${
                                selectedTemplate === key ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                              }`}>
                                {selectedTemplate === key && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className={`text-sm font-medium ${
                                selectedTemplate === key ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {config.name}
                              </div>
                              <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {config.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>打印</span>
              </button>
              
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isExporting
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : supabaseEnabled && !canExport
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Download className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
                <span>
                  {isExporting ? '导出中...' : supabaseEnabled && !canExport ? '分享解锁导出' : '导出PDF'}
                </span>
              </button>
              
              {/* 手动触发分享解锁（测试用） */}
              {supabaseEnabled && !canExport && resumeId && (
                <button
                  onClick={() => setShowShareModal(true)}
                  className="text-sm text-orange-600 hover:text-orange-800 transition-colors px-2 py-1 rounded hover:bg-orange-50"
                >
                  立即分享解锁
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 点击空白区域关闭模板选择器 */}
      {showTemplateSelector && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowTemplateSelector(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          <div className="resume-preview">
            {renderTemplate()}
          </div>
        </div>
        
        {/* 分享解锁提示（如果需要） */}
        {supabaseEnabled && !canExport && resumeId && (
          <div className="mt-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🔐</div>
              <div className="flex-1">
                <div className="text-sm text-orange-800">
                  <p className="font-semibold mb-1">分享解锁高清PDF导出</p>
                  <p className="text-orange-700 mb-2">
                    分享您的简历链接给朋友，获得3次点击即可永久解锁PDF导出功能！
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">当前进度：</span>
                      <span className="text-orange-600 font-bold">{currentClicks}/{requiredClicks}</span> 次点击
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={refreshPermission}
                        className="text-xs text-orange-600 hover:text-orange-800 font-medium underline"
                      >
                        刷新状态
                      </button>
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="text-xs bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                      >
                        立即分享
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 模板信息展示 */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div 
              className="w-6 h-6 rounded-full mt-0.5 flex-shrink-0" 
              style={{ backgroundColor: TEMPLATE_CONFIG[selectedTemplate].color }}
            ></div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">当前模板：{TEMPLATE_CONFIG[selectedTemplate].name}</p>
              <p className="text-blue-700">{TEMPLATE_CONFIG[selectedTemplate].description}</p>
              <p className="text-blue-600 text-xs mt-2">💡 您可以点击上方的模板选择器切换其他风格，每种模板都有独特的设计特色</p>
            </div>
          </div>
        </div>
        
        {/* 使用提示 */}
        <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">✨ 简历已生成完成！</p>
              <div className="text-green-700 space-y-1">
                <p>• 点击"导出PDF"下载高质量简历文件</p>
                <p>• 使用"打印"功能直接打印简历</p>
                <p>• 导出完成后，我们会邀请您分享使用体验，帮助我们改进产品</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 评价弹窗 */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmitted={handleFeedbackSubmitted}
      />

      {/* 分享解锁弹窗 */}
      {showShareModal && (
        <ShareUnlockModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          resumeId={resumeId}
          onUnlocked={handleShareUnlocked}
        />
      )}
    </div>
  )
}

export default ResumeEditor
