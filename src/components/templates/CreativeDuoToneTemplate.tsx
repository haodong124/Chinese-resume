import React from 'react'

// ... (接口定义相同)

const CreativeDuoToneTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
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
      
      {/* 分割式头部设计 */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        height: '140px'
      }}>
        {/* 左侧 - 深色区域 */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
          padding: '25px',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '8px',
            letterSpacing: '0.5px'
          }}>
            {personalInfo.name}
          </h1>
          {personalInfo.title && (
            <div style={{ 
              fontSize: '14px', 
              opacity: 0.9,
              fontWeight: '400'
            }}>
              {personalInfo.title}
            </div>
          )}
        </div>
        
        {/* 右侧 - 浅色区域 */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ 
            fontSize: '10px', 
            color: '#4a5568',
            space: '8px'
          }}>
            <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                width: '16px', 
                height: '16px', 
                background: '#1a202c', 
                borderRadius: '50%',
                marginRight: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '8px'
              }}>@</span>
              {personalInfo.email}
            </div>
            <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                width: '16px', 
                height: '16px', 
                background: '#1a202c', 
                borderRadius: '50%',
                marginRight: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '8px'
              }}>📱</span>
              {personalInfo.phone}
            </div>
            <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                width: '16px', 
                height: '16px', 
                background: '#1a202c', 
                borderRadius: '50%',
                marginRight: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '8px'
              }}>📍</span>
              {personalInfo.location}
            </div>
            {personalInfo.website && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ 
                  width: '16px', 
                  height: '16px', 
                  background: '#1a202c', 
                  borderRadius: '50%',
                  marginRight: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '8px'
                }}>🌐</span>
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '25px' }}>
        {/* 个人能力总结 */}
        {(skillsSummary || personalInfo.summary) && (
          <section style={{ 
            marginBottom: '25px',
            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '6px solid #1a202c'
          }}>
            <h2 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1a202c',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ 
                width: '8px', 
                height: '20px', 
                background: '#1a202c', 
                marginRight: '12px',
                borderRadius: '4px'
              }}></span>
              个人能力总结
            </h2>
            <div style={{ 
              fontSize: '12px', 
              lineHeight: '1.6',
              color: '#2d3748'
            }}>
              {skillsSummary || personalInfo.summary}
            </div>
          </section>
        )}

        {/* 左右分栏布局 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '30px'
        }}>
          {/* 左栏 */}
          <div>
            {/* 工作经历 */}
            {experience.length > 0 && (
              <section style={{ marginBottom: '25px' }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#1a202c',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    width: '6px', 
                    height: '24px', 
                    background: 'linear-gradient(180deg, #1a202c 0%, #4a5568 100%)', 
                    marginRight: '12px',
                    borderRadius: '3px'
                  }}></span>
                  工作经历
                </h2>
                
                {experience.map((exp, index) => (
                  <div key={exp.id} style={{ 
                    marginBottom: index < experience.length - 1 ? '20px' : '0',
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    paddingLeft: '24px'
                  }}>
                    {/* 左侧装饰条 */}
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      bottom: '0',
                      width: '4px',
                      background: index % 2 === 0 
                        ? 'linear-gradient(180deg, #1a202c 0%, #4a5568 100%)'
                        : 'linear-gradient(180deg, #4a5568 0%, #718096 100%)',
                      borderRadius: '0 2px 2px 0'
                    }}></div>
                    
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
                          color: '#1a202c',
                          marginBottom: '4px'
                        }}>
                          {exp.position}
                          {exp.isInternship && (
                            <span style={{ 
                              marginLeft: '8px',
                              fontSize: '10px',
                              backgroundColor: '#edf2f7',
                              color: '#4a5568',
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
                          color: '#4a5568',
                          fontWeight: '500'
                        }}>
                          {exp.company}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '11px',
                        color: 'white',
                        backgroundColor: '#1a202c',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontWeight: '500'
                      }}>
                        {exp.duration}
                      </div>
                    </div>
                    
                    <div style={{ 
                      fontSize: '11px',
                      color: '#2d3748',
                      lineHeight: '1.5',
                      marginBottom: '10px'
                    }}>
                      {exp.description}
                    </div>
                    
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div style={{ 
                        backgroundColor: '#f0fff4',
                        border: '1px solid #9ae6b4',
                        borderRadius: '6px',
                        padding: '10px'
                      }}>
                        <div style={{ 
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#276749',
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
                            color: '#22543d',
                            marginBottom: '3px',
                            paddingLeft: '12px',
                            position: 'relative'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: '0',
                              color: '#38a169',
                              fontWeight: 'bold'
                            }}>•</span>
                            {achievement}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* 项目经历 */}
            {projects.length > 0 && (
              <section>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#1a202c',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    width: '6px', 
                    height: '24px', 
                    background: 'linear-gradient(180deg, #1a202c 0%, #4a5568 100%)', 
                    marginRight: '12px',
                    borderRadius: '3px'
                  }}></span>
                  项目经历
                </h2>
                
                {projects.map((project, index) => (
                  <div key={project.id} style={{ 
                    marginBottom: index < projects.length - 1 ? '15px' : '0',
                    padding: '14px',
                    backgroundColor: '#f7fafc',
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
                        color: '#1a202c'
                      }}>
                        {project.name}
                      </div>
                      <div style={{ 
                        fontSize: '10px',
                        color: '#4a5568'
                      }}>
                        {project.duration}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '11px',
                      color: '#4a5568',
                      marginBottom: '6px',
                      fontWeight: '500'
                    }}>
                      {project.role}
                    </div>
                    <div style={{ 
                      fontSize: '11px',
                      color: '#2d3748',
                      lineHeight: '1.5',
                      marginBottom: '8px'
                    }}>
                      {project.description}
                    </div>
                    {project.technologies && (
                      <div style={{ 
                        fontSize: '10px',
                        color: '#718096'
                      }}>
                        <span style={{ fontWeight: '500' }}>技术栈：</span>
                        {project.technologies}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* 右栏 */}
          <div>
            {/* 教育背景 */}
            {education.length > 0 && (
              <section style={{ 
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#1a202c',
                borderRadius: '8px',
                color: 'white'
              }}>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '8px' }}>🎓</span>
                  教育背景
                </h3>
                
                {education.map((edu, index) => (
                  <div key={edu.id} style={{ 
                    marginBottom: index < education.length - 1 ? '12px' : '0'
                  }}>
                    <div style={{ 
                      fontSize: '11px',
                      fontWeight: '600',
                      marginBottom: '2px'
                    }}>
                      {edu.school}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      opacity: 0.9,
                      marginBottom: '2px'
                    }}>
                      {edu.degree} · {edu.major}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      opacity: 0.8
                    }}>
                      {edu.duration}
                    </div>
                    {edu.gpa && (
                      <div style={{ 
                        fontSize: '10px',
                        opacity: 0.8,
                        marginTop: '2px'
                      }}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* 技能专长 */}
            {skillCategories.length > 0 && (
              <section style={{ 
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#f7fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#1a202c',
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
                      color: '#2d3748',
                      marginBottom: '4px'
                    }}>
                      {category}
                    </div>
                    {skillGroups[category].map((skill, index) => (
                      <div key={index} style={{ 
                        fontSize: '10px',
                        color: '#4a5568',
                        marginBottom: '2px',
                        paddingLeft: '8px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          color: '#1a202c'
                        }}>•</span>
                        {skill}
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}

            {/* 语言能力 */}
            {languages && languages.length > 0 && (
              <section style={{ 
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#1a202c',
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
                      color: '#2d3748'
                    }}>
                      {language.name}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      color: '#4a5568',
                      fontWeight: '500'
                    }}>
                      {language.level}
                    </div>
                    {language.description && (
                      <div style={{ 
                        fontSize: '10px',
                        color: '#718096',
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
              <section style={{
                padding: '16px',
                backgroundColor: '#1a202c',
                borderRadius: '8px',
                color: 'white'
              }}>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
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
                    opacity: 0.9,
                    marginBottom: '6px',
                    paddingLeft: '12px',
                    position: 'relative',
                    lineHeight: '1.4'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: '0',
                      opacity: 1
                    }}>★</span>
                    {achievement.description}
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreativeDuoToneTemplate
