import React, { useState } from 'react'
import { ArrowLeft, Download, Palette, Printer, FileText } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export type TemplateType = 'modern' | 'classic' | 'azurill' | 'bronzor' | 'europass'

export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  title?: string
  summary?: string
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

  const achievementTypeLabels = {
    education: '学术成就',
    work: '工作成就',
    project: '项目成就',
    other: '其他成就'
  }

 // Europass模板渲染 - 中文版欧洲标准简历格式
const renderEuropassTemplate = () => (
  <div className="bg-white text-black" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1.4' }}>
    {/* Europass Header - 中文版 */}
    <div className="border-b-2 border-blue-600 pb-2 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-blue-600 font-semibold mb-1">个人简历</div>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-blue-600 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-blue-600 font-semibold">标准格式</div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6 p-4">
      {/* Left Column - Main Content */}
      <div className="col-span-2 space-y-6">
        {/* Personal Information - 个人信息 */}
        <section>
          <div className="bg-blue-50 p-4 rounded">
            <h2 className="text-sm font-bold text-blue-800 mb-3 uppercase">个人信息</h2>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">姓名：</span>
                <span className="text-black">{resumeData.personalInfo.name}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">邮箱：</span>
                <span className="text-black">{resumeData.personalInfo.email}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">电话：</span>
                <span className="text-black">{resumeData.personalInfo.phone}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">地址：</span>
                <span className="text-black">{resumeData.personalInfo.location}</span>
              </div>
              {resumeData.personalInfo.title && (
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-20">职位：</span>
                  <span className="text-black">{resumeData.personalInfo.title}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Professional Profile - 专业简介 */}
        {(resumeData.skillsSummary || resumeData.personalInfo.summary) && (
          <section>
            <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">专业简介</h2>
            <div className="text-black leading-relaxed text-sm">
              <p>{resumeData.skillsSummary || resumeData.personalInfo.summary}</p>
            </div>
          </section>
        )}

        {/* Work Experience - 工作经历 */}
        {resumeData.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">工作经历</h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="flex">
                  <div className="w-24 flex-shrink-0">
                    <div className="text-xs text-gray-600 font-semibold">{exp.duration}</div>
                  </div>
                  <div className="flex-1">
                    <div className="border-l-2 border-blue-200 pl-4">
                      <h3 className="font-bold text-black text-sm">{exp.position}</h3>
                      <p className="text-blue-600 font-semibold text-sm mb-2">{exp.company}</p>
                      <div className="text-black text-xs leading-relaxed">
                        {exp.description.split('\n').map((line, idx) => (
                          <p key={idx} className="mb-1">• {line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education and Training - 教育背景 */}
        {resumeData.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">教育背景</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="flex">
                  <div className="w-24 flex-shrink-0">
                    <div className="text-xs text-gray-600 font-semibold">{edu.duration}</div>
                  </div>
                  <div className="flex-1">
                    <div className="border-l-2 border-blue-200 pl-4">
                      <h3 className="font-bold text-black text-sm">{edu.degree}</h3>
                      <p className="text-blue-600 font-semibold text-sm">{edu.major}</p>
                      <p className="text-gray-700 text-xs">{edu.school}</p>
                      {edu.gpa && (
                        <p className="text-xs text-gray-600 mt-1">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects - 项目经历 */}
        {resumeData.projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">项目经历</h2>
            <div className="space-y-3">
              {resumeData.projects.map((project) => (
                <div key={project.id} className="border-l-2 border-blue-200 pl-4">
                  <h3 className="font-bold text-black text-sm">{project.name}</h3>
                  <p className="text-blue-600 text-xs mb-1">{project.role} • {project.duration}</p>
                  <p className="text-black text-xs leading-relaxed mb-2">{project.description}</p>
                  <p className="text-gray-600 text-xs"><strong>技术栈：</strong> {project.technologies}</p>
                  {project.link && (
                    <a href={project.link} className="text-blue-600 text-xs hover:underline inline-flex items-center mt-1">
                      🌐 查看项目
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements - 获奖经历 */}
        {resumeData.achievements && resumeData.achievements.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">获奖经历</h2>
            <div className="space-y-3">
              {resumeData.achievements.map((achievement) => (
                <div key={achievement.id} className="border-l-2 border-blue-200 pl-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-black text-sm">{achievement.title}</h3>
                    {achievement.date && (
                      <span className="text-xs text-gray-600">{achievement.date}</span>
                    )}
                  </div>
                  <p className="text-black text-xs leading-relaxed mt-1">{achievement.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Digital Competence - 专业技能 */}
        {resumeData.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">专业技能</h2>
            <div className="space-y-4">
              {Object.entries(
                resumeData.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = []
                  acc[skill.category].push(skill)
                  return acc
                }, {} as Record<string, Skill[]>)
              ).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="font-bold text-black text-xs mb-2">{category}</h3>
                  <div className="space-y-1">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex justify-between items-center">
                        <span className="text-xs text-black">{skill.name}</span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-2 h-2 border border-blue-300 ${
                                level <= (skill.level === 'expert' ? 5 : skill.level === 'proficient' ? 4 : 2)
                                  ? 'bg-blue-600'
                                  : 'bg-white'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages - 语言能力 */}
        <section>
          <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">语言能力</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-black">中文</span>
                <span className="text-xs text-blue-600">母语</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-xs">
                <div className="text-center">
                  <div className="text-gray-600">听</div>
                  <div className="font-semibold">C2</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">读</div>
                  <div className="font-semibold">C2</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">说</div>
                  <div className="font-semibold">C2</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">写</div>
                  <div className="font-semibold">C2</div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-black">英语</span>
                <span className="text-xs text-blue-600">熟练</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-xs">
                <div className="text-center">
                  <div className="text-gray-600">听</div>
                  <div className="font-semibold">B2</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">读</div>
                  <div className="font-semibold">B2</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">说</div>
                  <div className="font-semibold">B2</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">写</div>
                  <div className="font-semibold">B2</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certificates and Licenses - 证书资质 */}
        {resumeData.certificates && resumeData.certificates.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">证书资质</h2>
            <div className="space-y-3">
              {resumeData.certificates.map((cert) => (
                <div key={cert.id} className="bg-gray-50 p-3 rounded">
                  <h3 className="font-bold text-black text-xs">{cert.name}</h3>
                  <p className="text-blue-600 text-xs">{cert.issuer}</p>
                  <p className="text-gray-600 text-xs">{cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Information - 附加信息 */}
        <section>
          <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">附加信息</h2>
          <div className="space-y-2 text-xs text-black">
            <p><strong>驾驶证：</strong> 持有</p>
            <p><strong>推荐人：</strong> 可提供</p>
          </div>
        </section>

        {/* Hobbies and Interests - 兴趣爱好 */}
        <section>
          <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">兴趣爱好</h2>
          <div className="text-xs text-black">
            <p>技术研究、专业发展、开源贡献</p>
          </div>
        </section>
      </div>
    </div>

    {/* Footer - 中文版页脚 */}
    <div className="mt-6 pt-4 border-t border-gray-200 text-center">
      <div className="text-xs text-gray-500">
        标准简历格式 | 专业版本
      </div>
    </div>
  </div>
)

  // Azurill模板渲染 - 清新蓝绿色风格
  const renderAzurillTemplate = () => (
    <div className="bg-white text-sm leading-relaxed">
      {/* 头部区域 - 蓝绿色渐变背景 */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.name}</h1>
          {resumeData.personalInfo.title && (
            <p className="text-xl mb-4 opacity-95">{resumeData.personalInfo.title}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">📱</span>
              <span>{resumeData.personalInfo.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">📧</span>
              <span>{resumeData.personalInfo.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">📍</span>
              <span>{resumeData.personalInfo.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 个人简介 */}
        {resumeData.personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-600 mr-3 rounded-full"></span>
              个人简介
            </h2>
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border-l-4 border-teal-500">
              <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
            </div>
          </section>
        )}

        {/* 工作经历 */}
        {resumeData.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-600 mr-3 rounded-full"></span>
              💼 工作经历
            </h2>
            <div className="space-y-5">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="relative">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      {index < resumeData.experience.length - 1 && (
                        <div className="w-0.5 h-16 bg-gradient-to-b from-teal-500 to-teal-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-white border border-teal-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                            <p className="text-teal-600 font-semibold">{exp.company}</p>
                          </div>
                          <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 教育背景 */}
          {resumeData.education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-600 mr-3 rounded-full"></span>
                🎓 教育背景
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border-l-4 border-teal-400">
                    <h3 className="font-bold text-gray-900">{edu.school}</h3>
                    <p className="text-teal-700 font-semibold">{edu.degree} · {edu.major}</p>
                    <p className="text-gray-600 text-sm">{edu.duration}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 技能专长 */}
          {resumeData.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-600 mr-3 rounded-full"></span>
                💻 技能专长
              </h2>
              <div className="space-y-4">
                {Object.entries(
                  resumeData.skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  }, {} as Record<string, Skill[]>)
                ).map(([category, skills]) => (
                  <div key={category} className="bg-white p-4 rounded-lg border border-teal-100">
                    <h4 className="font-bold text-gray-800 mb-3 text-teal-700">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 rounded-full text-sm font-medium border border-teal-200"
                        >
                          {skill.name} ({levelLabels[skill.level]})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )

  // Bronzor模板渲染 - 专业商务风格
  const renderBronzorTemplate = () => (
    <div className="bg-white text-sm leading-relaxed">
      {/* 头部区域 - 深色专业风格 */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-500 to-orange-600 opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3 tracking-wide">{resumeData.personalInfo.name}</h1>
          {resumeData.personalInfo.title && (
            <p className="text-xl mb-4 text-amber-200 font-light">{resumeData.personalInfo.title}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">📱</div>
              <span className="text-gray-200">{resumeData.personalInfo.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">📧</div>
              <span className="text-gray-200">{resumeData.personalInfo.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">📍</div>
              <span className="text-gray-200">{resumeData.personalInfo.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* 个人简介 */}
        {resumeData.personalInfo.summary && (
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-amber-500 rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">个人简介</h2>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500 to-transparent ml-4"></div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-amber-500">
              <p className="text-gray-800 leading-relaxed text-base">{resumeData.personalInfo.summary}</p>
            </div>
          </section>
        )}

        {/* 工作经历 */}
        {resumeData.experience.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-amber-500 rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">工作经历</h2>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500 to-transparent ml-4"></div>
            </div>
            <div className="space-y-6">
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                      <p className="text-amber-600 font-semibold text-lg">{exp.company}</p>
                    </div>
                    <div className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium">
                      {exp.duration}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 教育背景 */}
          {resumeData.education.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-amber-500 rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">教育背景</h2>
              </div>
              <div className="space-y-4">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="bg-gray-800 text-white p-5 rounded-lg">
                    <h3 className="text-lg font-bold text-amber-300 mb-2">{edu.school}</h3>
                    <p className="text-gray-200 mb-1">{edu.degree} · {edu.major}</p>
                    <p className="text-gray-400 text-sm">{edu.duration}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 技能专长 */}
          {resumeData.skills.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-amber-500 rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">专业技能</h2>
              </div>
              <div className="space-y-5">
                {Object.entries(
                  resumeData.skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  }, {} as Record<string, Skill[]>)
                ).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="font-bold text-gray-800 mb-3 text-amber-600 uppercase tracking-wide">{category}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                          <span className="font-medium text-gray-900">{skill.name}</span>
                          <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {levelLabels[skill.level]}
                          </span>
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
    </div>
  )

  // 现代模板渲染
  const renderModernTemplate = () => (
    <div className="bg-white text-sm leading-relaxed">
      {/* 头部区域 - 蓝色渐变背景 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">{resumeData.personalInfo.name}</h1>
        {resumeData.personalInfo.title && (
          <p className="text-lg mb-3 opacity-90">{resumeData.personalInfo.title}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <span>📱</span>
            <span>{resumeData.personalInfo.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📧</span>
            <span>{resumeData.personalInfo.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span>{resumeData.personalInfo.location}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 个人简介 */}
        {resumeData.personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
              个人简介
            </h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </section>
        )}

        {/* 工作经历 */}
        {resumeData.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center">
              💼 工作经历
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-blue-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-gray-500 text-sm">{exp.duration}</span>
                  </div>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 教育背景 */}
          {resumeData.education.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center">
                🎓 教育背景
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                    <p className="text-blue-600">{edu.degree} · {edu.major}</p>
                    <p className="text-gray-500 text-sm">{edu.duration}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 技能专长 */}
          {resumeData.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center">
                💻 技能专长
              </h2>
              <div className="space-y-3">
                {Object.entries(
                  resumeData.skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  }, {} as Record<string, Skill[]>)
                ).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="font-medium text-gray-800 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className={`px-2 py-1 rounded text-xs font-medium ${levelColors[skill.level]}`}
                        >
                          {skill.name} ({levelLabels[skill.level]})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )

  // 经典模板渲染
  const renderClassicTemplate = () => (
    <div className="bg-white text-sm leading-relaxed">
      {/* 头部 */}
      <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{resumeData.personalInfo.name}</h1>
        {resumeData.personalInfo.title && (
          <p className="text-lg text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
        )}
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <span>{resumeData.personalInfo.phone}</span>
          <span>{resumeData.personalInfo.email}</span>
          <span>{resumeData.personalInfo.location}</span>
        </div>
      </div>

      {/* 个人简介 */}
      {resumeData.personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">个人简介</h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
        </section>
      )}

      {/* 工作经历 */}
      {resumeData.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">工作经历</h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-gray-500 text-sm">{exp.duration}</span>
                </div>
                <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 教育背景 */}
      {resumeData.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">教育背景</h2>
          <div className="space-y-3">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                    <p className="text-gray-700">{edu.degree} · {edu.major}</p>
                  </div>
                  <span className="text-gray-500 text-sm">{edu.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 技能专长 */}
      {resumeData.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">技能专长</h2>
          <div className="space-y-2">
            {Object.entries(
              resumeData.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = []
                acc[skill.category].push(skill)
                return acc
              }, {} as Record<string, Skill[]>)
            ).map(([category, skills]) => (
              <div key={category}>
                <strong className="text-gray-800">{category}:</strong>{' '}
                {skills.map((skill, index) => (
                  <span key={skill.id}>
                    {skill.name}({levelLabels[skill.level]})
                    {index < skills.length - 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )

  // 模板渲染选择器
  const renderTemplate = () => {
    switch (selectedTemplate) {
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
      default:
        return renderModernTemplate()
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
      // 显示加载提示
      const loadingToast = document.createElement('div')
      loadingToast.innerHTML = '正在生成PDF，请稍候...'
      loadingToast.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px;
        z-index: 9999; font-size: 16px;
      `
      document.body.appendChild(loadingToast)

      // 生成高质量截图
      const canvas = await html2canvas(element, {
        scale: 2, // 提高分辨率
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      })
      
      // 创建PDF
      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      // 计算图片在PDF中的尺寸
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width
      
      // 如果图片高度超过页面高度，需要分页
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      } else {
        // 分页处理
        let position = 0
        const pageHeight = pdfHeight
        
        while (position < imgHeight) {
          const remainingHeight = imgHeight - position
          const currentPageHeight = Math.min(pageHeight, remainingHeight)
          
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
      
      // 下载PDF
      const fileName = `${resumeData.personalInfo.name || '简历'}_${new Date().toLocaleDateString('zh-CN')}.pdf`
      pdf.save(fileName)
      
      // 移除加载提示
      document.body.removeChild(loadingToast)
      
      // 成功提示
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
      
      // 移除可能存在的加载提示
      const loadingToast = document.querySelector('div[style*="正在生成PDF"]')
      if (loadingToast) {
        document.body.removeChild(loadingToast)
      }
      
      // 错误提示
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
              {/* 模板切换 */}
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedTemplate}
                  onChange={(e) => onTemplateChange(e.target.value as TemplateType)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="europass">Europass模板</option>
                  <option value="modern">现代模板</option>
                  <option value="classic">经典模板</option>
                  <option value="azurill">Azurill模板</option>
                  <option value="bronzor">Bronzor模板</option>
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
