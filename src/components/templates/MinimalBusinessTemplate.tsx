import React from 'react'

// ... (接口定义相同)

const MinimalBusinessTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
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
           fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
           fontSize: '11px',
           lineHeight: '1.5',
           minHeight: '297mm',
           padding: '20mm 15mm 15mm 15mm'
         }}>
      
      {/* 极简头部 */}
      <div style={{ 
        textAlign: 'center',
        paddingBottom: '25px',
        marginBottom: '25px',
        borderBottom: '3px solid #000000'
      }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: '300', 
          marginBottom: '10px',
          color: '#000000',
          letterSpacing: '2px'
        }}>
          {personalInfo.name}
        </h1>
        {personalInfo.title && (
          <div style={{ 
            fontSize: '14px', 
            color: '#666666',
            fontWeight: '400',
            letterSpacing: '1px',
            marginBottom: '15px'
          }}>
            {personalInfo.title}
          </div>
        )}
        
        <div style={{ 
          fontSize: '10px', 
          color: '#999999',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <span>{personalInfo.email}</span>
          <span>|</span>
          <span>{personalInfo.phone}</span>
          <span>|</span>
          <span>{personalInfo.location}</span>
          {personalInfo.website && (
            <>
              <span>|</span>
              <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
            </>
          )}
        </div>
      </div>

      {/* 个人能力总结 */}
      {(skillsSummary || personalInfo.summary) && (
        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#000000',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            个人简介
          </h2>
          <div style={{ 
            fontSize: '11px', 
            lineHeight: '1.6',
            color: '#333333',
            textAlign: 'justify'
          }}>
            {skillsSummary || personalInfo.summary}
          </div>
        </section>
      )}

      {/* 双栏布局 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '30px'
      }}>
        {/* 左栏 - 主要内容 */}
        <div>
          {/* 工作经历 */}
          {experience.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#000000',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '1px solid #cccccc',
                paddingBottom: '5px'
              }}>
                工作经历
              </h2>
              
              {experience.map((exp, index) => (
                <div key={exp.id} style={{ 
                  marginBottom: index < experience.length - 1 ? '20px' : '0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'baseline',
                    marginBottom: '6px'
                  }}>
                    <div>
                      <div style={{ 
                        fontWeight: '600', 
                        fontSize: '12px',
                        color: '#000000'
                      }}>
                        {exp.position}
                        {exp.isInternship && (
                          <span style={{ 
                            marginLeft: '10px',
                            fontSize: '9px',
                            color: '#666666',
                            fontWeight: '400',
                            fontStyle: 'italic'
                          }}>
                            (实习)
                          </span>
                        )}
                      </div>
                      <div style={{ 
                        fontSize: '11px',
                        color: '#666666',
                        fontStyle: 'italic'
                      }}>
                        {exp.company}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      color: '#999999',
                      fontWeight: '500'
                    }}>
                      {exp.duration}
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: '11px',
                    color: '#333333',
                    lineHeight: '1.5',
                    marginBottom: '8px',
                    textAlign: 'justify'
                  }}>
                    {exp.description}
                  </div>
                  
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div style={{ 
                      borderLeft: '2px solid #e5e7eb',
                      paddingLeft: '12px',
                      marginTop: '8px'
                    }}>
                      {exp.achievements.map((achievement, achievementIndex) => (
                        <div key={achievementIndex} style={{ 
                          fontSize: '10px',
                          color: '#555555',
                          marginBottom: '3px',
                          position: 'relative'
                        }}>
                          <span style={{ 
                            marginRight: '6px',
                            color: '#000000'
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
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#000000',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '1px solid #cccccc',
                paddingBottom: '5px'
              }}>
                项目经历
              </h2>
              
              {projects.map((project, index) => (
                <div key={project.id} style={{ 
                  marginBottom: index < projects.length - 1 ? '15px' : '0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '6px'
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '12px',
                      color: '#000000'
                    }}>
                      {project.name}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      color: '#999999'
                    }}>
                      {project.duration}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '11px',
                    color: '#666666',
                    marginBottom: '6px',
                    fontStyle: 'italic'
                  }}>
                    {project.role}
                  </div>
                  <div style={{ 
                    fontSize: '11px',
                    color: '#333333',
                    lineHeight: '1.5',
                    marginBottom: '6px',
                    textAlign: 'justify'
                  }}>
                    {project.description}
                  </div>
                  {project.technologies && (
                    <div style={{ 
                      fontSize: '10px',
                      color: '#888888'
                    }}>
                      技术栈：{project.technologies}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* 右栏 - 辅助信息 */}
        <div>
          {/* 教育背景 */}
          {education.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#000000',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                教育背景
              </h3>
              
              {education.map((edu, index) => (
                <div key={edu.id} style={{ 
                  marginBottom: index < education.length - 1 ? '12px' : '0'
                }}>
                  <div style={{ 
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#000000',
                    marginBottom: '2px'
                  }}>
                    {edu.school}
                  </div>
                  <div style={{ 
                    fontSize: '10px',
                    color: '#666666',
                    marginBottom: '2px'
                  }}>
                    {edu.degree} · {edu.major}
                  </div>
                  <div style={{ 
                    fontSize: '10px',
                    color: '#999999'
                  }}>
                    {edu.duration}
                  </div>
                  {edu.gpa && (
                    <div style={{ 
                      fontSize: '10px',
                      color: '#666666',
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
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#000000',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                技能专长
              </h3>
              
              {skillCategories.map((category) => (
                <div key={category} style={{ marginBottom: '12px' }}>
                  <div style={{ 
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#333333',
                    marginBottom: '4px'
                  }}>
                    {category}
                  </div>
                  {skillGroups[category].map((skill, index) => (
                    <div key={index} style={{ 
                      fontSize: '10px',
                      color: '#666666',
                      marginBottom: '2px',
                      paddingLeft: '8px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#000000'
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
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#000000',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                语言能力
              </h3>
              
              {languages.map((language) => (
                <div key={language.id} style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#333333'
                  }}>
                    {language.name}
                  </div>
                  <div style={{ 
                    fontSize: '10px',
                    color: '#666666'
                  }}>
                    {language.level}
                  </div>
                  {language.description && (
                    <div style={{ 
                      fontSize: '9px',
                      color: '#999999',
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
              <h3 style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#000000',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                主要成就
              </h3>
              
              {achievements.map((achievement) => (
                <div key={achievement.id} style={{ 
                  fontSize: '10px',
                  color: '#333333',
                  marginBottom: '6px',
                  paddingLeft: '8px',
                  position: 'relative',
                  lineHeight: '1.4'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: '#000000'
                  }}>•</span>
                  {achievement.description}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default MinimalBusinessTemplate
