// components/templates/EuropassTemplate.tsx
import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, ExternalLink, Calendar } from 'lucide-react'

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

const EuropassTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates, skillsSummary, achievements } = resumeData

  const levelLabels = {
    beginner: 'Basic',
    intermediate: 'Independent', 
    advanced: 'Proficient',
    expert: 'Expert'
  }

  return (
    <div className="bg-white text-black" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1.4' }}>
      {/* Europass Header */}
      <div className="border-b-2 border-blue-600 pb-2 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-600 font-semibold mb-1">CURRICULUM VITAE</div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-600 font-semibold">Europass</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-4">
        {/* Left Column - Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Personal Information */}
          <section>
            <div className="bg-blue-50 p-4 rounded">
              <h2 className="text-sm font-bold text-blue-800 mb-3 uppercase">Personal Information</h2>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-20">Name:</span>
                  <span className="text-black">{personalInfo.name}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-20">Email:</span>
                  <span className="text-black">{personalInfo.email}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-20">Phone:</span>
                  <span className="text-black">{personalInfo.phone}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-20">Address:</span>
                  <span className="text-black">{personalInfo.location}</span>
                </div>
                {personalInfo.title && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-20">Position:</span>
                    <span className="text-black">{personalInfo.title}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Professional Profile */}
          {(skillsSummary || personalInfo.summary) && (
            <section>
              <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">Professional Profile</h2>
              <div className="text-black leading-relaxed text-sm">
                <p>{skillsSummary || personalInfo.summary}</p>
              </div>
            </section>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">Work Experience</h2>
              <div className="space-y-4">
                {experience.map((exp, index) => (
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

          {/* Education and Training */}
          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">Education and Training</h2>
              <div className="space-y-4">
                {education.map((edu) => (
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

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">Projects</h2>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="border-l-2 border-blue-200 pl-4">
                    <h3 className="font-bold text-black text-sm">{project.name}</h3>
                    <p className="text-blue-600 text-xs mb-1">{project.role} • {project.duration}</p>
                    <p className="text-black text-xs leading-relaxed mb-2">{project.description}</p>
                    <p className="text-gray-600 text-xs"><strong>Technologies:</strong> {project.technologies}</p>
                    {project.link && (
                      <a href={project.link} className="text-blue-600 text-xs hover:underline inline-flex items-center mt-1">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">Achievements and Awards</h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
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
          {/* Digital Competence */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">Digital Competence</h2>
              <div className="space-y-4">
                {Object.entries(
                  skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  }, {} as Record<string, typeof skills>)
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
                                  level <= (skill.level === 'expert' ? 5 : skill.level === 'advanced' ? 4 : skill.level === 'intermediate' ? 3 : 2)
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

          {/* Languages */}
          <section>
            <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">Languages</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-black">English</span>
                  <span className="text-xs text-blue-600">C2</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div className="text-center">
                    <div className="text-gray-600">Listening</div>
                    <div className="font-semibold">C2</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Reading</div>
                    <div className="font-semibold">C2</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Speaking</div>
                    <div className="font-semibold">C2</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Writing</div>
                    <div className="font-semibold">C2</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Certificates and Licenses */}
          {certificates && certificates.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">Certificates</h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-gray-50 p-3 rounded">
                    <h3 className="font-bold text-black text-xs">{cert.name}</h3>
                    <p className="text-blue-600 text-xs">{cert.issuer}</p>
                    <p className="text-gray-600 text-xs">{cert.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Information */}
          <section>
            <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">Additional Information</h2>
            <div className="space-y-2 text-xs text-black">
              <p><strong>Driving License:</strong> Category B</p>
              <p><strong>References:</strong> Available upon request</p>
            </div>
          </section>

          {/* Hobbies and Interests */}
          <section>
            <h2 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1 uppercase">Hobbies and Interests</h2>
            <div className="text-xs text-black">
              <p>Technology trends, Open source development, Professional networking</p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <div className="text-xs text-gray-500">
          © European Union, 2002-2024 | europass.eu
        </div>
      </div>
    </div>
  )
}

export default EuropassTemplate
