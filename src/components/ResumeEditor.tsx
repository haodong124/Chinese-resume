import React, { useState } from 'react'
import { ArrowLeft, Download, Printer, FileText } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// 导入标准模板
import StandardTemplate from './templates/StandardTemplate'

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

  const handleExportPDF = async () => {
    const element = document.querySelector('.resume-preview') as HTMLElement
    if (!element) {
      alert('找不到简历预览区域，请刷新页面重试')
      return
    }

    try {
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
                className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download className="h-4 w-4" />
                <span>导出PDF</span>
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
      </main>
    </div>
  )
}

export default ResumeEditor
