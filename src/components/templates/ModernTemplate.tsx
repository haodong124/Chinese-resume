import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const ModernTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates } = resumeData

  return (
    <div className={`bg-white ${isPreview ? 'text-xs' : 'text-sm'} leading-relaxed`}>
      {/* 头部区域 - 蓝色渐变背景 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`${isPreview ? 'text-xl' : 'text-3xl'} font-bold mb-2`}>
              {personalInfo.name}
            </h1>
            <p className={`${isPreview ? 'text-sm' : 'text-xl'} mb-4 opacity-90`}>
              {personalInfo.title}
            </p>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 ${isPreview ? 'text-xs' : 'text-sm'}`}>
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
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* 个人简介 */}
        {personalInfo.summary && (
          <section className="mb-8">
            <h2 className={`${isPreview ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600`}>
              个人简介
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* 工作经历 */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className={`${isPreview ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center`}>
              <Briefcase className="h-5 w-5 mr-2" />
              工作经历
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
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

        {/* 项目经历 */}
        {projects.length > 0 && (
          <section className="mb-8">
            <h2 className={`${isPreview ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center`}>
              <FolderOpen className="h-5 w-5 mr-2" />
              项目经历
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  <p className="text-sm text-blue-600 mb-2">技术栈: {project.technologies}</p>
                  {project.link && (
                    <a href={project.link} className="text-blue-600 hover:underline text-sm flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      查看项目
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 教育背景 */}
          {education.length > 0 && (
            <section>
              <h2 className={`${isPreview ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center`}>
                <GraduationCap className="h-5 w-5 mr-2" />
                教育背景
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
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
          {skills.length > 0 && (
            <section>
              <h2 className={`${isPreview ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center`}>
                <Code className="h-5 w-5 mr-2" />
                技能专长
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 证书资质 */}
        {certificates.length > 0 && (
          <section className="mt-8">
            <h2 className={`${isPreview ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center`}>
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

export default ModernTemplate