import React from 'react'

interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  title?: string
  summary?: string
  website?: string
}

interface Education {
  id: string
  school: string
  degree: string
  major: string
  duration: string
  description: string
  gpa?: string
}

interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description: string
  isInternship?: boolean
  achievements?: string[]
}

interface Project {
  id: string
  name: string
  role: string
  duration: string
  description: string
  technologies: string
  link?: string
}

interface Skill {
  id: string
  name: string
  level: 'understand' | 'proficient' | 'expert'
  category: string
  description?: string
  capabilities?: string[]
}

interface Achievement {
  id: string
  title: string
  description: string
  type: 'education' | 'work' | 'project' | 'other'
  date?: string
}

interface Language {
  id: string
  name: string
  level: string
  description?: string
}

interface ResumeData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  skillsSummary?: string
  achievements: Achievement[]
  languages: Language[]
}

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const ChineseAzurillTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, skillsSummary, achievements, languages } = resumeData

  // 技能分组处理
  const formatSkillsForDisplay = () => {
    if (!skills || skills.length === 0) return {}
    
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category || '其他技能'
      if (!acc[category]) acc[category] = []
      
      const skillText = skill.description 
        ? `${skill.name}：${skill.description}`
        : skill.name
      
      acc[category].push(skillText)
      return acc
    }, {} as Record<string, string[]>)

    return groupedSkills
  }

  const skillGroups = formatSkillsForDisplay()

  return (
    <div className="p-custom space-y-3" style={{ 
      fontFamily: '"Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif',
      fontSize: '11px',
      lineHeight: '1.4',
      padding: '15mm'
    }}>
      {/* Header - 完全按照Azurill源码 */}
      <div className="flex flex-col items-center justify-center space-y-2 pb-2 text-center">
        {/* Picture placeholder */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: '#e5e7eb',
          marginBottom: '8px'
        }}></div>

        <div>
          <div className="text-2xl font-bold" style={{ marginBottom: '4px' }}>
            {personalInfo.name}
          </div>
          <div className="text-base">{personalInfo.title || '专业人士'}</div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
          {personalInfo.location && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-map-pin text-primary" style={{ color: '#2563eb' }}>📍</i>
              <div>{personalInfo.location}</div>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-phone text-primary" style={{ color: '#2563eb' }}>📞</i>
              <div>{personalInfo.phone}</div>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-at text-primary" style={{ color: '#2563eb' }}>✉</i>
              <div>{personalInfo.email}</div>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-link text-primary" style={{ color: '#2563eb' }}>🔗</i>
              <div>{personalInfo.website.replace(/^https?:\/\//, '')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Summary - 按照Azurill源码格式 */}
      {(skillsSummary || personalInfo.summary) && (
        <section id="summary">
          <div className="mb-2 hidden font-bold text-primary group-[.main]:block">
            <h4 style={{ color: '#2563eb', fontSize: '14px', fontWeight: 'bold' }}>个人简介</h4>
          </div>

          <div className="mb-2 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
            <div className="size-1.5 rounded-full border border-primary" style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              border: '1px solid #2563eb' 
            }}></div>
            <h4 style={{ color: '#2563eb', fontSize: '14px', fontWeight: 'bold' }}>个人简介</h4>
            <div className="size-1.5 rounded-full border border-primary" style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              border: '1px solid #2563eb' 
            }}></div>
          </div>

          <main className="relative space-y-2" style={{ 
            borderLeft: '1px solid #2563eb', 
            paddingLeft: '16px',
            position: 'relative'
          }}>
            <div className="absolute left-[-4.5px] top-[8px] hidden size-[8px] rounded-full bg-primary group-[.main]:block" style={{
              position: 'absolute',
              left: '-4.5px',
              top: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#2563eb'
            }}></div>

            <div className="wysiwyg" style={{ 
              fontSize: '11px',
              lineHeight: '1.5',
              color: '#374151'
            }}>
              {skillsSummary || personalInfo.summary}
            </div>
          </main>
        </section>
      )}

      {/* Grid Layout - 3列布局完全按照源码 */}
      <div className="grid grid-cols-3 gap-x-4">
        {/* Sidebar - 1/3 width */}
        <div className="sidebar group space-y-4">
          {/* 技能专长 */}
          {Object.keys(skillGroups).length > 0 && (
            <section>
              <div className="mb-2 hidden font-bold text-primary group-[.main]:block">
                <h4 style={{ color: '#2563eb', fontSize: '14px', fontWeight: 'bold' }}>技能专长</h4>
              </div>

              <div className="mx-auto mb-2 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  border: '1px solid #2563eb' 
                }}></div>
                <h4 style={{ color: '#2563eb', fontSize: '14px', fontWeight: 'bold' }}>技能专长</h4>
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  border: '1px solid #2563eb' 
                }}></div>
              </div>

              <div className="grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto group-[.sidebar]:text-center">
                {Object.entries(skillGroups).map(([category, skillList]) => (
                  <div key={category} style={{ 
                    borderLeft: '1px solid #2563eb', 
                    paddingLeft: '16px',
                    position: 'relative',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '-4.5px',
                      top: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb'
                    }}></div>
                    
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '11px',
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      {category}
                    </div>
                    
                    {skillList.map((skill, index) => (
                      <div key={index} style={{ 
                        fontSize: '11px',
                        color: '#374151',
                        marginBottom: '2px',
                        lineHeight: '1.3'
                      }}>
                        • {skill}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 语言能力 */}
          {languages && languages.length > 0 && (
            <section>
              <div className="mx-auto mb-2 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  border: '1px solid #2563eb' 
                }}></div>
                <h4 style={{ color: '#2563eb', fontSize: '14px', fontWeight: 'bold' }}>语言能力</h4>
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  border: '1px solid #2563eb' 
                }}></div>
              </div>

              <div className="grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto group-[.sidebar]:text-center">
                {languages.map((language) => (
                  <div key={language.id} style={{ 
                    borderLeft: '1px solid #2563eb', 
                    paddingLeft: '16px',
                    position: 'relative',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '-4.5px',
                      top: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb'
                    }}></div>
                    
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '11px',
                      color: '#111827'
                    }}>
                      {language.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px',
                      color: '#374151'
                    }}>
                      {language.level}
                    </div>
                    {language.description && (
                      <div style={{ 
                        fontSize: '10px',
                        color: '#6b7280',
                        fontStyle: 'italic'
                      }}>
                        {language.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 项目经历 */}
          {projects.length > 0 && (
            <section>
              <div className="mx-auto mb-2 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  border: '1px solid #2563eb' 
                }}></div>
                <h4 style={{ color: '#2563eb', fontSize: '14px', fontWeight: 'bold' }}>项目经历</h4>
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  border: '1px solid #2563eb' 
                }}></div>
              </div>

              <div className="grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto group-[.sidebar]:text-center">
                {projects.map((project) => (
                  <div key={project.id} style={{ 
                    borderLeft: '1px solid #2563eb', 
                    paddingLeft: '16px',
                    position: 'relative',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '-4.5px',
                      top: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb'
                    }}></div>
                    
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '11px',
                      color: '#111827',
                      marginBottom: '2px'
                    }}>
                      {project.name}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      color: '#2563eb',
                      marginBottom: '2px'
                    }}>
                      {project.role}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      color: '#6b7280',
                      marginBottom: '2px'
                    }}>
                      {project.duration}
                    </div>
                    {project.description && (
                      <div style={{ 
                        fontSize: '10px',
                        color: '#374151',
                        lineHeight: '1.3'
                      }}>
                        {project.description}
                      </div>
                    )}
                    {project.technologies && (
                      <div style={{ 
                        fontSize: '10px',
                        color: '#2563eb',
                        marginTop: '2px'
                      }}>
                        技术：{project.technologies}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Main Content - 2/3 width */}
        <div className="main group space-y-4" style={{ gridColumn: 'span 2' }}>
          {/* 工作经历 */}
          {experience.length > 0 && (
            <section>
              <div className="mb-2 hidden font-bold text-primary group-[.main]:block">
                <h4 style={{ color: '#2563eb', fontSize: '14px', fontWeight: 'bold' }}>工作经历</h4>
              </div>

              <div className="grid gap-x-6 gap-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} style={{ 
                    borderLeft: '1px solid #2563eb', 
                    paddingLeft: '16px',
                    position: 'relative',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '-4.5px',
                      top: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb'
                    }}></div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '4px'
                    }}>
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          color: '#111827'
                        }}>
                          {exp.position} | {exp.duration}
                        </div>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '11px',
                          color: '#374151'
                        }}>
                          {exp.company} - {personalInfo.location?.split(',').pop()?.trim() || 'China'}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ 
                        margin: 0, 
                        paddingLeft: '0',
                        listStyle: 'none'
                      }}>
                        <div style={{ 
                          fontSize: '11px',
                          marginBottom: '4px',
                          position: 'relative',
                          paddingLeft: '8px',
                          lineHeight: '1.4',
                          color: '#374151'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: '0',
                            fontWeight: 'bold',
                            color: '#000000'
                          }}>•</span>
                          {exp.description}
                        </div>
                        
                        {exp.achievements && exp.achievements.map((achievement, achievementIndex) => (
                          <div key={achievementIndex} style={{ 
                            fontSize: '11px',
                            marginBottom: '4px',
                            position: 'relative',
                            paddingLeft: '8px',
                            lineHeight: '1.4',
                            color: '#374151'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: '0',
                              fontWeight: 'bold',
                              color: '#000000'
                            }}>•</span>
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 教育背景 */}
          {education.length > 0 && (
            <section>
              <div className="mb-2 hidden font-bold text-primary group-[.main]:block">
                <h4 style={{ color: '#2563eb', fontSize: '14px', fontWeight: 'bold' }}>教育背景</h4>
              </div>

              <div className="grid gap-x-6 gap-y-3">
                {education.map((edu) => (
                  <div key={edu.id} style={{ 
                    borderLeft: '1px solid #2563eb', 
                    paddingLeft: '16px',
                    position: 'relative',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '-4.5px',
                      top: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb'
                    }}></div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start'
                    }}>
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '11px',
                          color: '#111827'
                        }}>
                          {edu.school} - {personalInfo.location} | {edu.degree}
                        </div>
                        <div style={{ 
                          fontSize: '11px',
                          color: '#374151'
                        }}>
                          {edu.major}，{edu.duration}
                        </div>
                      </div>
                    </div>
                    {edu.description && (
                      <div style={{ 
                        fontSize: '11px',
                        marginTop: '4px',
                        color: '#6b7280'
                      }}>
                        {edu.description}
                      </div>
                    )}
                    {edu.gpa && (
                      <div style={{ 
                        fontSize: '11px',
                        marginTop: '2px',
                        color: '#6b7280'
                      }}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 主要成就 */}
          {achievements && achievements.length > 0 && (
            <section>
              <div className="mb-2 hidden font-bold text-primary group-[.main]:block">
                <h4 style={{ color: '#2563eb', fontSize: '14px', fontWeight: 'bold' }}>主要成就</h4>
              </div>

              <div className="grid gap-x-6 gap-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} style={{ 
                    borderLeft: '1px solid #2563eb', 
                    paddingLeft: '16px',
                    position: 'relative',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '-4.5px',
                      top: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb'
                    }}></div>
                    
                    <div style={{ 
                      fontSize: '11px',
                      color: '#374151',
                      lineHeight: '1.4'
                    }}>
                      {achievement.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* 打印样式 */}
      <style jsx>{`
        @media print {
          .bg-white {
            background: white !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
        .sidebar .group-[.sidebar]:flex {
          display: flex !important;
        }
        .sidebar .group-[.sidebar]:hidden {
          display: none !important;
        }
        .main .group-[.main]:block {
          display: block !important;
        }
        .main .group-[.main]:hidden {
          display: none !important;
        }
        .sidebar .group-[.sidebar]:mx-auto {
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .sidebar .group-[.sidebar]:text-center {
          text-align: center !important;
        }
      `}</style>
    </div>
  )
}

export default ChineseAzurillTemplate
