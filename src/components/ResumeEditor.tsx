import React, { useState } from 'react'
import { ArrowLeft, Download, Printer, FileText } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// 导入标准模板
import StandardTemplate from './templates/StandardTemplate'
// 导入评价弹窗组件
import FeedbackModal from './FeedbackModal'

export type TemplateType = 'standard'

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

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  setResumeData,
  selectedTemplate,
  onTemplateChange,
  onBack
}) => {
  // 评价弹窗状态
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // 数据适配器 - 确保数据格式兼容模板
  const adaptDataForTemplate = (data: ResumeData): ResumeData => {
    const adaptedExperience = data.experience.map(exp => ({
      ...exp,
      role: exp.position,
    }))

    return {
      ...data,
      experience: adaptedExperience,
      personalInfo: {
        ...data.personalInfo,
        website: data.personalInfo.website || ''
      }
    }
  }

  // 统一使用标准模板
  const renderTemplate = () => {
    const adaptedData = adaptDataForTemplate(resumeData)
    return <StandardTemplate resumeData={adaptedData} />
  }

  // 处理评价提交成功
  const handleFeedbackSubmitted = () => {
    setFeedbackSubmitted(true)
    setShowFeedbackModal(false)
  }

  const handleExportPDF = async () => {
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
      
      const fileName = `${resumeData.personalInfo.name || '简历'}_${new Date().toLocaleDateString('zh-CN')}.pdf`
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">标准简历模板</span>
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>打印</span>
              </button>
              
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isExporting
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Download className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
                <span>{isExporting ? '导出中...' : '导出PDF'}</span>
              </button>
              
              {/* 手动触发评价按钮（开发测试用） */}
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                分享反馈
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          <div className="resume-preview">
            {renderTemplate()}
          </div>
        </div>
        
        {/* 使用提示 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">简历已生成完成！</p>
              <p>您可以点击"导出PDF"下载简历文件，或使用打印功能。导出完成后，我们会邀请您分享使用体验，帮助我们改进产品。</p>
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
    </div>
  )
}

export default ResumeEditor
