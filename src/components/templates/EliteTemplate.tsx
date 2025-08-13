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

const EliteTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
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
           fontFamily: '"Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif',
           fontSize: '11px',
           lineHeight: '1.4',
           minHeight: '297mm',
           padding: '0'
         }}>
      
      {/* 顶部蓝色装饰条 */}
      <div style={{ height: '8px', background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)' }}></div>
      
      <div style={{ padding: '20mm 15mm 15mm 15mm' }}>
        {/* 头部区域 */}
        <div style={{ 
          borderBottom: '2px solid #e5e7eb', 
          paddingBottom: '20px', 
          marginBottom: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              marginBottom: '8px',
              color: '#1e40af',
              letterSpacing: '0.5px'
            }}>
              {personalInfo.name}
            </h1>
            {personalInfo.title && (
              <div style={{ 
                fontSize: '16px', 
                color: '#374151',
                fontWeight: '500',
                marginBottom: '12px'
              }}>
                {personalInfo.title}
              </div>
            )}
            <div style={{ 
              fontSize: '10px', 
              color: '#6b7280',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#1e40af', marginRight: '6px', fontWeight: 'bold' }}>📧</span>
                {personalInfo.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#1e40af', marginRight: '6px', fontWeight: 'bold' }}>📱</span>
                {personalInfo.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#1e40af', marginRight: '6px', fontWeight: 'bold' }}>📍</span>
                {personalInfo.location}
              </div>
              {personalInfo.website && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e40af', marginRight: '6px', fontWeight: 'bold' }}>🌐</span>
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </div>
              )}
            </div>
          </div>
          
          {/* 右侧装饰性图形 */}
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            marginLeft: '20px'
          }}>
            {personalInfo.name.charAt(0)}
          </div>
        </div>

        {/* 个人能力总结 */}
        {(skillsSummary || personalInfo.summary) && (
          <section style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '4px',
                height: '18px',
                background: '#1e40af',
                marginRight: '10px'
              }}></div>
              <h2 style={{ 
                fontSize: '14px', 
                fontWeight: '700', 
                color: '#1e40af',
                margin: 0
              }}>
                个人能力总结
              </h2>
            </div>
            <div style={{ 
              fontSize: '11px', 
              lineHeight: '1.6',
              color: '#374151',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderLeft: '3px solid #1e40af',
              borderRadius: '0 4px 4px 0'
            }}>
              {skillsSummary || personalInfo.summary}
            </div>
          </section>
        )}

        {/* 主体内容区域 - 双栏布局 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '30px'
        }}>
          {/* 左栏 - 主要内容 */}
          <div style={{ space: '20px' }}>
            {/* 工作经历 */}
            {experience.length > 0 && (
              <section style={{ marginBottom: '22px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '4px',
                    height: '18px',
                    background: '#1e40af',
                    marginRight: '10px'
                  }}></div>
                  <h2 style={{ 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    color: '#1e40af',
                    margin: 0
                  }}>
                    工作经历
                  </h2>
                </div>
                
                <div style={{ position: 'relative', paddingLeft: '20px' }}>
                  {/* 时间线 */}
                  <div style={{
                    position: 'absolute',
                    left: '8px',
                    top: '5px',
                    bottom: '0',
                    width: '2px',
                    background: '#e5e7eb'
                  }}></div>
                  
                  {experience.map((exp, index) => (
                    <div key={exp.id} style={{ 
                      marginBottom: index < experience.length - 1 ? '18px' : '0',
                      position: 'relative'
                    }}>
                      {/* 时间线节点 */}
                      <div style={{
                        position: 'absolute',
                        left: '-16px',
                        top: '3px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#1e40af',
                        border: '2px solid white',
                        boxShadow: '0 0 0 2px #1e40af'
                      }}></div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '6px'
                      }}>
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            fontSize: '12px',
                            color: '#111827',
                            marginBottom: '2px'
                          }}>
                            {exp.position}
                            {exp.isInternship && (
                              <span style={{ 
                                marginLeft: '8px',
                                fontSize: '10px',
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontWeight: '500'
                              }}>
                                实习
                              </span>
                            )}
                          </div>
                          <div style={{ 
                            fontSize: '11px',
                            color: '#6b7280',
                            fontWeight: '500'
                          }}>
                            {exp.company}
                          </div>
                        </div>
                        <div style={{ 
                          fontSize: '10px',
                          color: '#1e40af',
                          fontWeight: '600',
                          backgroundColor: '#f0f9ff',
                          padding: '4px 8px',
                          borderRadius: '12px'
                        }}>
                          {exp.duration}
                        </div>
                      </div>
                      
                      <div style={{ 
                        fontSize: '11px',
                        color: '#374151',
                        lineHeight: '1.5',
                        marginBottom: '8px'
                      }}>
                        {exp.description}
                      </div>
                      
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div style={{ 
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '6px',
                          padding: '8px'
                        }}>
                          <div style={{ 
                            fontSize: '10px',
                            fontWeight: '600',
                            color: '#16a34a',
                            marginBottom: '4px'
                          }}>
                            主要成就：
                          </div>
                          {exp.achievements.map((achievement, achievementIndex) => (
                            <div key={achievementIndex} style={{ 
                              fontSize: '10px',
                              color: '#166534',
                              marginBottom: '2px',
                              paddingLeft: '8px',
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

            {/* 项目经历 */}
            {projects.length > 0 && (
              <section style={{ marginBottom: '22px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '4px',
                    height: '18px',
                    background: '#1e40af',
                    marginRight: '10px'
                  }}></div>
                  <h2 style={{ 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    color: '#1e40af',
                    margin: 0
                  }}>
                    项目经历
                  </h2>
                </div>
                
                <div style={{ space: '12px' }}>
                  {projects.map((project, index) => (
                    <div key={project.id} style={{ 
                      marginBottom: index < projects.length - 1 ? '12px' : '0',
                      padding: '12px',
                      backgroundColor: '#fafafa',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb'
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
                        color: '#1e40af',
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        {project.role}
                      </div>
                      <div style={{ 
                        fontSize: '11px',
                        color: '#374151',
                        lineHeight: '1.5',
                        marginBottom: '6px'
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

          {/* 右栏 - 辅助信息 */}
          <div>
            {/* 技能专长 */}
            {skillCategories.length > 0 && (
              <section style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '4px',
                    height: '18px',
                    background: '#1e40af',
                    marginRight: '8px'
                  }}></div>
                  <h2 style={{ 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: '#1e40af',
                    margin: 0
                  }}>
                    技能专长
                  </h2>
                </div>
                
                {skillCategories.map((category) => (
                  <div key={category} style={{ marginBottom: '12px' }}>
                    <div style={{ 
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px',
                      padding: '4px 8px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px'
                    }}>
                      {category}
                    </div>
                    {skillGroups[category].map((skill, index) => (
                      <div key={index} style={{ 
                        fontSize: '10px',
                        color: '#4b5563',
                        marginBottom: '3px',
                        paddingLeft: '8px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          color: '#1e40af',
                          fontWeight: 'bold'
                        }}>•</span>
                        {skill}
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}

            {/* 教育背景 */}
            {education.length > 0 && (
              <section style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '4px',
                    height: '18px',
                    background: '#1e40af',
                    marginRight: '8px'
                  }}></div>
                  <h2 style={{ 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: '#1e40af',
                    margin: 0
                  }}>
                    教育背景
                  </h2>
                </div>
                
                {education.map((edu, index) => (
                  <div key={edu.id} style={{ 
                    marginBottom: index < education.length - 1 ? '10px' : '0',
                    padding: '8px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '2px'
                    }}>
                      {edu.school}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      color: '#1e40af',
                      marginBottom: '2px'
                    }}>
                      {edu.degree} · {edu.major}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      color: '#6b7280'
                    }}>
                      {edu.duration}
                    </div>
                    {edu.gpa && (
                      <div style={{ 
                        fontSize: '10px',
                        color: '#374151',
                        marginTop: '2px'
                      }}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* 语言能力 */}
            {languages && languages.length > 0 && (
              <section style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '4px',
                    height: '18px',
                    background: '#1e40af',
                    marginRight: '8px'
                  }}></div>
                  <h2 style={{ 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: '#1e40af',
                    margin: 0
                  }}>
                    语言能力
                  </h2>
                </div>
                
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
                      color: '#1e40af',
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
              </section>
            )}

            {/* 主要成就 */}
            {achievements && achievements.length > 0 && (
              <section>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '4px',
                    height: '18px',
                    background: '#1e40af',
                    marginRight: '8px'
                  }}></div>
                  <h2 style={{ 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: '#1e40af',
                    margin: 0
                  }}>
                    主要成就
                  </h2>
                </div>
                
                {achievements.map((achievement) => (
                  <div key={achievement.id} style={{ 
                    fontSize: '10px',
                    color: '#374151',
                    marginBottom: '6px',
                    paddingLeft: '8px',
                    position: 'relative',
                    lineHeight: '1.4'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: '0',
                      color: '#eab308',
                      fontWeight: 'bold'
                    }}>★</span>
                    {achievement.description}
                  </div>
                ))}
              </section>
            )}
          </div>
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
      `}</style>
    </div>
  )
}

export default EliteTemplate
