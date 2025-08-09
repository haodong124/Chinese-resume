import React, { useState } from 'react'
import { ArrowLeft, Download, Palette, Printer, FileText } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// 导入所有模板组件
import CreativeDuoToneTemplate from './templates/CreativeDuoToneTemplate'
import EuropassLiteTemplate from './templates/EuropassLiteTemplate'
import FlatInfographicTemplate from './templates/FlatInfographicTemplate'
import FreshGreenTemplate from './templates/FreshGreenTemplate'
import MagazineStyleTemplate from './templates/MagazineStyleTemplate'
import MinimalBusinessTemplate from './templates/MinimalBusinessTemplate'
import ModernCardTemplate from './templates/ModernCardTemplate'
import TechBlueTemplate from './templates/TechBlueTemplate'
import AcademicCVTemplate from './templates/AcademicCVTemplate'
import BlackGoldTemplate from './templates/BlackGoldTemplate'

// 扩展模板类型
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
  role?: string // 兼容某些模板
  duration: string
  description: string
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
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview')

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

  // 数据适配器 - 确保数据格式兼容所有模板
  const adaptDataForTemplate = (data: ResumeData): ResumeData => {
    // 将 position 映射到 role（某些模板使用 role）
    const adaptedExperience = data.experience.map(exp => ({
      ...exp,
      role: exp.position, // 添加 role 字段
    }))

    return {
      ...data,
      experience: adaptedExperience,
      personalInfo: {
        ...data.personalInfo,
        website: data.personalInfo.website || '' // 确保有 website 字段
      }
    }
  }

  // Europass模板渲染 - 原有模板
  const renderEuropassTemplate = () => (
    <div className="bg-white text-black" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1.4' }}>
      {/* ... 原有的 Europass 模板代码 ... */}
      {/* 这里保持您原有的 Europass 模板代码不变 */}
    </div>
  )

  // Azurill模板渲染 - 原有模板
  const renderAzurillTemplate = () => (
    <div className="bg-white text-sm leading-relaxed">
      {/* ... 原有的 Azurill 模板代码 ... */}
      {/* 这里保持您原有的 Azurill 模板代码不变 */}
    </div>
  )

  // Bronzor模板渲染 - 原有模板
  const renderBronzorTemplate = () => (
    <div className="bg-white text-sm leading-relaxed">
      {/* ... 原有的 Bronzor 模板代码 ... */}
      {/* 这里保持您原有的 Bronzor 模板代码不变 */}
    </div>
  )

  // 现代模板渲染 - 原有模板
  const renderModernTemplate = () => (
    <div className="bg-white text-sm leading-relaxed">
      {/* ... 原有的 Modern 模板代码 ... */}
      {/* 这里保持您原有的 Modern 模板代码不变 */}
    </div>
  )

  // 经典模板渲染 - 原有模板
  const renderClassicTemplate = () => (
    <div className="bg-white text-sm leading-relaxed">
      {/* ... 原有的 Classic 模板代码 ... */}
      {/* 这里保持您原有的 Classic 模板代码不变 */}
    </div>
  )

  // 模板渲染选择器 - 扩展版本
  const renderTemplate = () => {
    const adaptedData = adaptDataForTemplate(resumeData)
    
    switch (selectedTemplate) {
      // 原有模板
      case 'europass':
        return renderEuropassTemplate()
      case 'azurill':
        return renderAzurillTemplate()
      case 'bronzor':
        return renderBronzorTemplate()
      case 'modern':
        return renderModernTemplate()
      case 'classic':
        return renderClassicTemplate()
      
      // 新增模板
      case 'creative-duotone':
        return <CreativeDuoToneTemplate resumeData={adaptedData} />
      case 'europass-lite':
        return <EuropassLiteTemplate resumeData={adaptedData} />
      case 'flat-infographic':
        return <FlatInfographicTemplate resumeData={adaptedData} />
      case 'fresh-green':
        return <FreshGreenTemplate resumeData={adaptedData} />
      case 'magazine-style':
        return <MagazineStyleTemplate resumeData={adaptedData} />
      case 'minimal-business':
        return <MinimalBusinessTemplate resumeData={adaptedData} />
      case 'modern-card':
        return <ModernCardTemplate resumeData={adaptedData} />
      case 'tech-blue':
        return <TechBlueTemplate resumeData={adaptedData} />
      case 'academic-cv':
        return <AcademicCVTemplate resumeData={adaptedData} />
      case 'black-gold':
        return <BlackGoldTemplate resumeData={adaptedData} />
      
      default:
        return renderModernTemplate()
    }
  }

  // 模板分类和信息
  const templateCategories = {
    professional: {
      label: '专业商务',
      templates: [
        { value: 'modern', label: '现代模板' },
        { value: 'classic', label: '经典模板' },
        { value: 'minimal-business', label: '极简商务' },
        { value: 'magazine-style', label: '杂志风格' },
      ]
    },
    creative: {
      label: '创意设计',
      templates: [
        { value: 'creative-duotone', label: '创意双色' },
        { value: 'azurill', label: 'Azurill清新' },
        { value: 'bronzor', label: 'Bronzor专业' },
        { value: 'fresh-green', label: '清新绿色' },
        { value: 'black-gold', label: '黑金奢华' },
      ]
    },
    technical: {
      label: '技术/学术',
      templates: [
        { value: 'tech-blue', label: '科技蓝' },
        { value: 'academic-cv', label: '学术简历' },
        { value: 'modern-card', label: '现代卡片' },
        { value: 'flat-infographic', label: '扁平信息图' },
      ]
    },
    standard: {
      label: '标准格式',
      templates: [
        { value: 'europass', label: 'Europass标准' },
        { value: 'europass-lite', label: 'Europass精简' },
      ]
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = async () => {
    const element = document.querySelector('.resume-preview') as HTMLElement
    if (!element) {
      alert('找不到简历预览区域，请刷新页面重试')
      return
    }

    try {
      const loadingToast = document.createElement('div')
      loadingToast.innerHTML = '正在生成PDF，请稍候...'
      loadingToast.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px;
        z-index: 9999; font-size: 16px;
      `
      document.body.appendChild(loadingToast)

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      })
      
      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width
      
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
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
            imgHeight
          )
          
          position += pageHeight
        }
      }
      
      const fileName = `${resumeData.personalInfo.name || '简历'}_${new Date().toLocaleDateString('zh-CN')}.pdf`
      pdf.save(fileName)
      
      document.body.removeChild(loadingToast)
      
      const successToast = document.createElement('div')
      successToast.innerHTML = '✅ PDF导出成功！'
      successToast.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #10b981; color: white; padding: 12px 20px; border-radius: 8px;
        z-index: 9999; font-size: 14px;
      `
      document.body.appendChild(successToast)
      setTimeout(() => document.body.removeChild(successToast), 3000)
      
    } catch (error) {
      console.error('PDF导出失败:', error)
      
      const loadingToast = document.querySelector('div[style*="正在生成PDF"]')
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
              {/* 增强的模板切换 */}
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedTemplate}
                  onChange={(e) => onTemplateChange(e.target.value as TemplateType)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(templateCategories).map(([key, category]) => (
                    <optgroup key={key} label={category.label}>
                      {category.templates.map(template => (
                        <option key={template.value} value={template.value}>
                          {template.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* 操作按钮 */}
              <button
                onClick={handlePrint}
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
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('preview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                简历预览
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'edit'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                继续编辑
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'preview' ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
            <div className="resume-preview">
              {renderTemplate()}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">继续编辑功能</h2>
            <p className="text-gray-600">
              编辑功能正在开发中...您可以返回上一步修改信息，或切换到预览模式查看简历效果。
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default ResumeEditor
