// components/templates/BronzorTemplate.tsx
import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, ExternalLink } from 'lucide-react'

interface TemplateProps {
  resumeData: ResumeData & {
    skillsSummary?: string
    achievements?: Array<{
      id: string
      title: string
      description: string
      type: string
      date?: string
    }>
  }
  isPreview?: boolean
}

const BronzorTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates, skillsSummary, achievements } = resumeData

  const levelLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate', 
    advanced: 'Advanced',
    expert: 'Expert'
  }

  return (
    <div className="bg-white text-black" style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px', lineHeight: '1.5' }}>
      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Left Column - Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Profiles */}
          <section>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 underline">LinkedIn</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-800 underline">GitHub</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-600 underline">StackOverflow</span>
              </div>
            </div>
          </section>

          {/* Header */}
          <div className="border-b-2 border-green-600 pb-4">
            <h1 className="text-3xl font-bold text-black mb-2">{personalInfo.name}</h1>
            <p className="text-lg text-green-600 font-medium">{personalInfo.title}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{personalInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          {(skillsSummary || personalInfo.summary) && (
            <section>
              <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Summary</h2>
              <div className="text-black leading-relaxed">
                <p>{skillsSummary || personalInfo.summary}</p>
              </div>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-black">{exp.position}</h3>
                        <p className="text-green-600 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-600">{exp.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                    <div className="text-black text-sm">
                      <ul className="list-disc list-inside space-y-1">
                        {exp.description.split('\n').map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Education</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-black">{edu.school}</h3>
                        <p className="text-green-600">{edu.degree} · {edu.major}</p>
                        <p className="text-sm text-gray-600">{edu.school}</p>
                      </div>
                      <span className="text-sm text-gray-600">{edu.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Projects</h2>
              <div className="grid grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="font-bold text-black text-sm">{project.name}</h3>
                    <p className="text-sm text-green-600">{project.role}</p>
                    <p className="text-xs text-black leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Skills</h2>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(
                  skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  }, {} as Record<string, typeof skills>)
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="font-bold text-black text-sm">{category}</h3>
                    <p className="text-sm text-green-600 mb-1">
                      {categorySkills[0]?.level ? levelLabels[categorySkills[0].level] : 'Intermediate'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {categorySkills.map((skill, index) => (
                        <span key={skill.id} className="text-xs text-black">
                          {skill.name}{index < categorySkills.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certificates && certificates.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Certifications</h2>
              <div className="grid grid-cols-1 gap-3">
                {certificates.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-bold text-black text-sm">{cert.name}</h3>
                    <p className="text-sm text-green-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-600">{cert.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          <section>
            <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Languages</h2>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="font-bold text-black text-sm">English</span>
                <p className="text-sm text-green-600">Native Speaker</p>
              </div>
              <div>
                <span className="font-bold text-black text-sm">Spanish</span>
                <p className="text-sm text-green-600">Intermediate</p>
              </div>
            </div>
          </section>

          {/* References */}
          <section>
            <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">References</h2>
            <p className="text-black text-sm">Available upon request</p>
          </section>

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Awards</h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id}>
                    <h3 className="font-bold text-black text-sm">{achievement.title}</h3>
                    {achievement.date && (
                      <p className="text-xs text-gray-600">{achievement.date}</p>
                    )}
                    <p className="text-xs text-black leading-relaxed">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty sections */}
          <section>
            <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Interests</h2>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Volunteering</h2>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">Publications</h2>
          </section>
        </div>
      </div>
    </div>
  )
}

export default BronzorTemplate
