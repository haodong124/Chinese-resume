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

interface Certificate {
  id: string
  name: string
  issuer: string
  date: string
  link?: string
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

interface IndustryAnalysis {
  trends: string[]
  emergingSkills: string[]
  decliningSkills: string[]
  aiImpact: string
  remoteWorkImpact: string
}

interface ResumeData {
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

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const ModernTimelineTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates, skillsSummary, achievements, languages } = resumeData

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
  const skillCategories = Object.keys(skillGroups)

  return (
    <div className="bg-white text-black max-w-[210mm] mx-auto" 
         style={{ 
           fontFamily: '"Source Han Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif',
           fontSize: '11px',
           lineHeight: '1.4',
           minHeight: '297mm',
           padding: '0'
         }}>
      
      {/* 渐变背景头部 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '25px 20px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 装饰性图形 */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          transform: 'rotate(45deg)'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            marginBottom: '8px',
            letterSpacing: '0.5px'
          }}>
            {personalInfo.name}
          </h1>
          {personalInfo.title && (
            <div style={{ 
              fontSize: '18px', 
              opacity: 0.9,
              fontWeight: '400',
              marginBottom: '15px'
            }}>
              {personalInfo.title}
            </div>
          )}
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            fontSize: '11px',
            opacity: 0.95
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '14px' }}>✉</span>
              {personalInfo.email}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '14px' }}>📱</span>
              {personalInfo.phone}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '14px' }}>📍</span>
              {personalInfo.location}
            </div>
            {personalInfo.website && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontSize: '14px' }}>🌐</span>
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '25px 20px' }}>
        {/* 个人能力总结 */}
        {(skillsSummary || personalInfo.summary) && (
          <section style={{ 
            marginBottom: '25px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f6f9fc 0%, #e9f4ff 100%)',
            borderRadius: '12px',
            border: '1px solid #e1e8ed'
          }}>
            <h2 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#667eea',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ 
                width: '6px', 
                height: '20px', 
                background: '#667eea', 
                marginRight: '12px',
                borderRadius: '3px'
              }}></span>
              个人能力总结
            </h2>
            <div style={{ 
              fontSize: '12px', 
              lineHeight: '1.6',
              color: '#374151'
            }}>
              {skillsSummary || personalInfo.summary}
            </div>
          </section>
        )}

        {/* 时间线布局 */}
        <div style={{ position: 'relative' }}>
          {/* 主时间线 */}
          <div style={{
            position: 'absolute',
            left: '30px',
            top: '0',
            bottom: '0',
            width: '3px',
            background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '2px'
          }}></div>

          {/* 工作经历 */}
          {experience.length > 0 && (
            <section style={{ marginBottom: '30px', position: 'relative' }}>
              {/* 时间线节点 */}
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '8px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#667eea',
                border: '4px solid white',
                boxShadow: '0 0 0 3px #e1e8ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                💼
              </div>
              
              <div style={{ marginLeft: '60px' }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#667eea',
                  marginBottom: '15px'
                }}>
                  工作经历
                </h2>
                
                {experience.map((exp, index) => (
                  <div key={exp.id} style={{ 
                    marginBottom: index < experience.length - 1 ? '20px' : '0',
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e1e8ed',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.08)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '13px',
                          color: '#111827',
                          marginBottom: '4px'
                        }}>
                          {exp.position}
                          {exp.isInternship && (
                            <span style={{ 
                              marginLeft: '8px',
                              fontSize: '10px',
                              backgroundColor: '#667eea',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontWeight: '500'
                            }}>
                              实习
                            </span>
                          )}
                        </div>
                        <div style={{ 
                          fontSize: '12px',
                          color: '#667eea',
                          fontWeight: '500'
                        }}>
                          {exp.company}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '11px',
                        color: 'white',
                        backgroundColor: '#764ba2',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontWeight: '500'
                      }}>
                        {exp.duration}
                      </div>
                    </div>
                    
                    <div style={{ 
                      fontSize: '11px',
                      color: '#374151',
                      lineHeight: '1.5',
                      marginBottom: '10px'
                    }}>
                      {exp.description}
                    </div>
                    
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div style={{ 
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        padding: '10px'
                      }}>
                        <div style={{ 
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#16a34a',
                          marginBottom: '6px',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <span style={{ marginRight: '6px' }}>🏆</span>
                          主要成就
                        </div>
                        {exp.achievements.map((achievement, achievementIndex) => (
                          <div key={achievementIndex} style={{ 
                            fontSize: '10px',
                            color: '#166534',
                            marginBottom: '3px',
                            paddingLeft: '12px',
                            position: 'relative'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: '0',
                              color: '#16a34a',
                              fontWeight: 'bold'
                            }}>•</span>
                            {achievement}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 教育背景 */}
          {education.length > 0 && (
            <section style={{ marginBottom: '30px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '8px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#764ba2',
                border: '4px solid white',
                boxShadow: '0 0 0 3px #e1e8ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px'
              }}>
                🎓
              </div>
              
              <div style={{ marginLeft: '60px' }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#764ba2',
                  marginBottom: '15px'
                }}>
                  教育背景
                </h2>
                
                {education.map((edu, index) => (
                  <div key={edu.id} style={{ 
                    marginBottom: index < education.length - 1 ? '15px' : '0',
                    padding: '14px',
                    backgroundColor: '#fefefe',
                    borderRadius: '8px',
                    border: '1px solid #e1e8ed'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '6px'
                    }}>
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '12px',
                          color: '#111827'
                        }}>
                          {edu.school}
                        </div>
                        <div style={{ 
                          fontSize: '11px',
                          color: '#764ba2',
                          marginTop: '2px'
                        }}>
                          {edu.degree} · {edu.major}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '11px',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        {edu.duration}
                      </div>
                    </div>
                    {edu.description && (
                      <div style={{ 
                        fontSize: '10px',
                        color: '#374151',
                        marginTop: '6px',
                        lineHeight: '1.4'
                      }}>
                        {edu.description}
                      </div>
                    )}
                    {edu.gpa && (
                      <div style={{ 
                        fontSize: '10px',
                        color: '#6b7280',
                        marginTop: '4px'
                      }}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 项目经历 */}
          {projects.length > 0 && (
            <section style={{ marginBottom: '30px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '8px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '4px solid white',
                boxShadow: '0 0 0 3px #e1e8ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '11px'
              }}>
                📂
              </div>
              
              <div style={{ marginLeft: '60px' }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#667eea',
                  marginBottom: '15px'
                }}>
                  项目经历
                </h2>
                
                {projects.map((project, index) => (
                  <div key={project.id} style={{ 
                    marginBottom: index < projects.length - 1 ? '15px' : '0',
                    padding: '14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '6px'
                    }}>
                      <div style={{ 
                        fontWeight: '600', 
                        fontSize: '12px',
                        color: '#111827'
                      }}>
                        {project.name}
                      </div>
                      <div style={{ 
                        fontSize: '10px',
                        color: '#6b7280'
                      }}>
                        {project.duration}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '11px',
                      color: '#667eea',
                      marginBottom: '6px',
                      fontWeight: '500'
                    }}>
                      {project.role}
                    </div>
                    <div style={{ 
                      fontSize: '11px',
                      color: '#374151',
                      lineHeight: '1.5',
                      marginBottom: '8px'
                    }}>
                      {project.description}
                    </div>
                    {project.technologies && (
                      <div style={{ 
                        fontSize: '10px',
                        color: '#6b7280'
                      }}>
                        <span style={{ fontWeight: '500' }}>技术栈：</span>
                        {project.technologies}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 底部信息区域 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '25px'
        }}>
          {/* 技能专长 */}
          {skillCategories.length > 0 && (
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#667eea',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>🚀</span>
                技能专长
              </h3>
              
              {skillCategories.map((category) => (
                <div key={category} style={{ marginBottom: '10px' }}>
                  <div style={{ 
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '4px'
                  }}>
                    {category}
                  </div>
                  {skillGroups[category].map((skill, index) => (
                    <div key={index} style={{ 
                      fontSize: '10px',
                      color: '#6b7280',
                      marginBottom: '2px',
                      paddingLeft: '8px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#667eea'
                      }}>•</span>
                      {skill}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* 语言能力 */}
          {languages && languages.length > 0 && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fefefe',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#764ba2',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>🌍</span>
                语言能力
              </h3>
              
              {languages.map((language) => (
                <div key={language.id} style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    {language.name}
                  </div>
                  <div style={{ 
                    fontSize: '10px',
                    color: '#764ba2',
                    fontWeight: '500'
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
          )}

          {/* 主要成就 */}
          {achievements && achievements.length > 0 && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fff7ed',
              borderRadius: '10px',
              border: '1px solid #fed7aa'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#ea580c',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>⭐</span>
                主要成就
              </h3>
              
              {achievements.map((achievement) => (
                <div key={achievement.id} style={{ 
                  fontSize: '10px',
                  color: '#9a3412',
                  marginBottom: '6px',
                  paddingLeft: '12px',
                  position: 'relative',
                  lineHeight: '1.4'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: '#ea580c'
                  }}>★</span>
                  {achievement.description}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModernTimelineTemplate
