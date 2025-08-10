import React, { useState } from 'react'
import { ArrowLeft, Download, Palette, Printer, FileText, Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderOpen, ExternalLink } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// 导入模板组件
import AzurillTemplate from './templates/AzurillTemplate'
import BronzorTemplate from './templates/BronzorTemplate'
import EuropassTemplate from './templates/EuropassTemplate'
import ModernTemplate from './templates/ModernTemplate'

export type TemplateType = 
  | 'modern' 
  | 'classic' 
  | 'azurill' 
  | 'bronzor' 
  | 'europass'

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
  const adaptDataForTemplate = (data: ResumeData): ResumeData & { skillsSummary?: string; achievements?: Achievement[] } => {
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
      },
      skillsSummary: data.skillsSummary,
      achievements: data.achievements
    }
  }

  // 现代模板渲染 - 完整实现
  const renderModernTemplate = () => {
    const { personalInfo, experience, education, skills, projects, certificates, skillsSummary } = resumeData

    return (
      <div className="bg-white text-sm leading-relaxed">
        {/* 头部区域 - 蓝色渐变背景 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {personalInfo.name}
              </h1>
              <p className="text-xl mb-4 opacity-90">
                {personalInfo.title}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{personalInfo.location}</span>
                </div>
                {personalInfo.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>{personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* 个人简介/技能总结 */}
          {(skillsSummary || personalInfo.summary) && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
                个人简介
              </h2>
              <p className="text-gray-700 leading-relaxed">{skillsSummary || personalInfo.summary}</p>
            </section>
          )}

          {/* 教育背景 */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                教育背景
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                        <p className="text-blue-600">{edu.degree} · {edu.major}</p>
                        {edu.gpa && (
                          <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                        )}
                        {edu.description && (
                          <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">{edu.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 工作经历 */}
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                工作经历
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-blue-200">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                          {exp.isInternship && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">实习</span>
                          )}
                        </div>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-gray-500 text-sm">{exp.duration}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">主要成就：</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {exp.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 技能专长 - 增强版本 */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center">
                <Code className="h-5 w-5 mr-2" />
                技能专长
              </h2>
              <div className="space-y-4">
                {Object.entries(
                  skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  }, {} as Record<string, typeof skills>)
                ).map(([category, categorySkills]) => (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
                    <div className="space-y-2">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{skill.name}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${levelColors[skill.level]}`}>
                                {levelLabels[skill.level]}
                              </span>
                            </div>
                            {skill.description && (
                              <p className="text-sm text-gray-600">{skill.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 项目经历 */}
          {projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center">
                <FolderOpen className="h-5 w-5 mr-2" />
                项目经历
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-blue-600 text-sm mb-2">{project.role} · {project.duration}</p>
                    <p className="text-gray-700 mb-2 text-sm">{project.description}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">技术栈:</span> {project.technologies}
                    </p>
                    {project.link && (
                      <a href={project.link} className="text-blue-600 hover:underline text-sm flex items-center">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        查看项目
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 证书资质 */}
          {certificates.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                证书资质
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Award className="h-6 w-6 text-yellow-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.issuer} · {cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    )
  }

  // 经典模板渲染
  const renderClassicTemplate = () => {
    const { personalInfo, experience, education, skills, projects, certificates, skillsSummary } = resumeData

    return (
      <div className="bg-white text-sm leading-relaxed" style={{ fontFamily: 'serif' }}>
        {/* 头部 */}
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.name}</h1>
          <p className="text-xl text-gray-700 mb-4">{personalInfo.title}</p>
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
            <span>{personalInfo.phone}</span>
            <span>•</span>
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.location}</span>
          </div>
        </div>

        <div className="px-8">
          {/* 个人简介 */}
          {(skillsSummary || personalInfo.summary) && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
                个人简介
              </h2>
              <p className="text-gray-700 leading-relaxed">{skillsSummary || personalInfo.summary}</p>
            </section>
          )}

          {/* 教育背景 */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-1">
                教育背景
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{edu.school}</h3>
                        <p className="text-gray-700">{edu.degree} - {edu.major}</p>
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-gray-600 font-medium">{edu.duration}</span>
                    </div>
                    {edu.description && (
                      <p className="text-gray-600 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 工作经历 */}
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-1">
                工作经历
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{exp.position}</h3>
                          {exp.isInternship && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">实习</span>
                          )}
                        </div>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-gray-600 font-medium">{exp.duration}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">主要成就：</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {exp.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 技能专长 */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-1">
                技能专长
              </h2>
              <div className="space-y-4">
                {Object.entries(
                  skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  }, {} as Record<string, typeof skills>)
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="font-bold text-gray-900 mb-2">{category}</h3>
                    <div className="space-y-2">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="flex items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{skill.name}</span>
                              <span className="text-gray-600">({levelLabels[skill.level]})</span>
                            </div>
                            {skill.description && (
                              <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    )
  }

  // 模板渲染选择器
  const renderTemplate = () => {
    const adaptedData = adaptDataForTemplate(resumeData)
    
    switch (selectedTemplate) {
      case 'europass':
        return <EuropassTemplate resumeData={adaptedData} />
      case 'azurill':
        return <AzurillTemplate resumeData={adaptedData} />
      case 'bronzor':
        return <BronzorTemplate resumeData={adaptedData} />
      case 'modern':
        return renderModernTemplate()
      case 'classic':
        return renderClassicTemplate()
      default:
        return renderModernTemplate()
    }
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
                <Palette className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedTemplate}
                  onChange={(e) => onTemplateChange(e.target.value as TemplateType)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="modern">现代模板</option>
                  <option value="classic">经典模板</option>
                  <option value="azurill">Azurill清新</option>
                  <option value="bronzor">Bronzor专业</option>
                  <option value="europass">Europass标准</option>
                </select>
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
