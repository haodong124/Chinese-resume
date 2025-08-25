import React from 'react'
import type { ResumeData } from '../ResumeEditor'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const AmericanBusinessTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates, achievements, languages } = resumeData

  // 技能分组处理
  const formatSkillsForDisplay = () => {
    if (!skills || skills.length === 0) return {}
    
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category || '专业技能'
      if (!acc[category]) acc[category] = []
      acc[category].push(skill.name)
      return acc
    }, {} as Record<string, string[]>)

    return groupedSkills
  }

  const skillGroups = formatSkillsForDisplay()

  // 获取技能等级文本
  const getSkillLevelText = (level: string) => {
    const levelMap: Record<string, string> = {
      'understand': 'Beginner',
      'proficient': 'Intermediate', 
      'expert': 'Advanced'
    }
    return levelMap[level] || 'Intermediate'
  }

  // 分类技能（用于Skills部分的三列布局）
  const categorizeSkills = () => {
    const webTech: string[] = []
    const frameworks: string[] = []
    const tools: string[] = []
    
    skills?.forEach(skill => {
      if (skill.category?.includes('前端') || skill.category?.includes('语言') || skill.category?.includes('Web')) {
        webTech.push(skill.name)
      } else if (skill.category?.includes('框架') || skill.category?.includes('库')) {
        frameworks.push(skill.name)
      } else {
        tools.push(skill.name)
      }
    })
    
    return { webTech, frameworks, tools }
  }

  const { webTech, frameworks, tools } = categorizeSkills()

  return (
    <div className="bg-white text-black max-w-[210mm] mx-auto" 
         style={{ 
           fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
           fontSize: '11px',
           lineHeight: '1.4',
           minHeight: '297mm',
           padding: '15mm 20mm'
         }}>
      
      {/* 顶部个人信息区域 */}
      <header style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          {/* 左侧：头像占位符 */}
          <div style={{ 
            width: '80px', 
            height: '100px', 
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>👤</div>
              <div>照片</div>
            </div>
          </div>
          
          {/* 中间：姓名和职位信息 */}
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              marginBottom: '4px',
              color: '#000'
            }}>
              {personalInfo.name || '姓名'}
            </h1>
            
            <div style={{ 
              fontSize: '14px', 
              color: '#333',
              marginBottom: '8px'
            }}>
              {personalInfo.title || '职位名称'}
            </div>
            
            {/* 联系信息 */}
            <div style={{ 
              fontSize: '11px',
              color: '#555',
              lineHeight: '1.6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                <span style={{ color: '#dc2626' }}>📍</span>
                <span>{personalInfo.location || '城市, 省份'}</span>
                <span style={{ marginLeft: '12px', color: '#dc2626' }}>📞</span>
                <span>{personalInfo.phone || '手机号码'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#dc2626' }}>✉️</span>
                <span style={{ color: '#dc2626' }}>{personalInfo.email || 'email@example.com'}</span>
                {personalInfo.website && (
                  <>
                    <span style={{ marginLeft: '12px', color: '#dc2626' }}>🔗</span>
                    <span style={{ color: '#dc2626' }}>{personalInfo.website}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* 右侧：社交媒体图标 */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center'
          }}>
            <div style={{ 
              fontSize: '10px',
              color: '#0077b5',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>in</span>
              <span style={{ fontSize: '9px' }}>linkedin</span>
            </div>
            <div style={{ 
              fontSize: '10px',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>🐙</span>
              <span style={{ fontSize: '9px' }}>github</span>
            </div>
          </div>
        </div>
      </header>

      {/* 分割线 */}
      <div style={{ 
        borderBottom: '1px solid #d1d5db', 
        marginBottom: '16px' 
      }}></div>

      {/* Summary 部分 */}
      {(personalInfo.summary || resumeData.skillsSummary) && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: '#dc2626',
            marginBottom: '8px'
          }}>
            Summary
          </h2>
          <div style={{ 
            fontSize: '11px', 
            lineHeight: '1.6',
            color: '#333'
          }}>
            {personalInfo.summary || resumeData.skillsSummary || '专业技能总结'}
          </div>
        </section>
      )}

      {/* Experience 部分 */}
      {experience && experience.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: '#dc2626',
            marginBottom: '10px'
          }}>
            Experience
          </h2>
          
          {experience.map((exp, index) => (
            <div key={exp.id} style={{ marginBottom: index < experience.length - 1 ? '16px' : '0' }}>
              <div style={{ marginBottom: '6px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'baseline'
                }}>
                  <div>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      color: '#000'
                    }}>
                      {exp.company}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    {exp.duration}
                  </div>
                </div>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginTop: '2px'
                }}>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#333'
                  }}>
                    {exp.position}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#333'
                  }}>
                    {personalInfo.location?.split(',')[0] || '城市'}, {personalInfo.location?.split(',')[1] || '省份'}
                  </div>
                </div>
                {exp.company.includes('http') && (
                  <div style={{ 
                    fontSize: '10px',
                    color: '#dc2626',
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>🔗</span>
                    <span>{exp.company}</span>
                  </div>
                )}
              </div>
              
              {/* 工作描述 */}
              <div style={{ paddingLeft: '20px' }}>
                {exp.description && (
                  <div style={{ 
                    fontSize: '11px',
                    color: '#333',
                    lineHeight: '1.5',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#666' }}>•</span>
                    <span>{exp.description}</span>
                  </div>
                )}
                
                {exp.achievements && exp.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} style={{ 
                    fontSize: '11px',
                    color: '#333',
                    lineHeight: '1.5',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#666' }}>•</span>
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Education 部分 */}
      {education && education.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: '#dc2626',
            marginBottom: '10px'
          }}>
            Education
          </h2>
          
          {education.map((edu, index) => (
            <div key={edu.id} style={{ marginBottom: index < education.length - 1 ? '12px' : '0' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    {edu.school}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#333'
                  }}>
                    {edu.major}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#333'
                  }}>
                    {personalInfo.location?.split(',')[0] || '城市'}, {personalInfo.location?.split(',')[1] || '省份'}
                  </div>
                  {edu.school.includes('http') && (
                    <div style={{ 
                      fontSize: '10px',
                      color: '#dc2626',
                      marginTop: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>🔗</span>
                      <span>{edu.school}</span>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    {edu.duration}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#333'
                  }}>
                    {edu.degree}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects 部分 */}
      {projects && projects.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: '#dc2626',
            marginBottom: '10px'
          }}>
            Projects
          </h2>
          
          {projects.map((project, index) => (
            <div key={project.id} style={{ marginBottom: index < projects.length - 1 ? '12px' : '0' }}>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '2px'
              }}>
                {project.name}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#333',
                marginBottom: '4px'
              }}>
                {project.role}
              </div>
              <div style={{ 
                fontSize: '11px',
                color: '#333',
                lineHeight: '1.5'
              }}>
                {project.description}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Certifications 部分 */}
      {certificates && certificates.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: '#dc2626',
            marginBottom: '10px'
          }}>
            Certifications
          </h2>
          
          <div style={{ display: 'flex', gap: '40px' }}>
            {certificates.map((cert) => (
              <div key={cert.id} style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      color: '#000'
                    }}>
                      {cert.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#333'
                    }}>
                      {cert.issuer}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    {cert.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills 部分 - 三列布局 */}
      {skills && skills.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: '#dc2626',
            marginBottom: '10px'
          }}>
            Skills
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px'
          }}>
            {/* Web Technologies 列 */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '6px'
              }}>
                Web Technologies
              </div>
              <div style={{ 
                fontSize: '10px',
                color: '#666',
                marginBottom: '4px'
              }}>
                Advanced
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#333',
                lineHeight: '1.4'
              }}>
                {webTech.length > 0 ? webTech.join(', ') : 'HTML5, JavaScript, CSS3'}
              </div>
            </div>
            
            {/* Web Frameworks 列 */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '6px'
              }}>
                Web Frameworks
              </div>
              <div style={{ 
                fontSize: '10px',
                color: '#666',
                marginBottom: '4px'
              }}>
                Intermediate
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#333',
                lineHeight: '1.4'
              }}>
                {frameworks.length > 0 ? frameworks.join(', ') : 'React.js, Vue.js, Angular'}
              </div>
            </div>
            
            {/* Tools 列 */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '6px'
              }}>
                Tools
              </div>
              <div style={{ 
                fontSize: '10px',
                color: '#666',
                marginBottom: '4px'
              }}>
                Intermediate
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#333',
                lineHeight: '1.4'
              }}>
                {tools.length > 0 ? tools.join(', ') : 'Git, Webpack, Docker'}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* References 部分 */}
      <section>
        <h2 style={{ 
          fontSize: '13px', 
          fontWeight: 'bold', 
          color: '#dc2626',
          marginBottom: '10px'
        }}>
          References
        </h2>
        <div style={{ 
          fontSize: '11px', 
          color: '#333'
        }}>
          Available upon request
        </div>
      </section>

      {/* 打印样式 */}
      <style jsx>{`
        @media print {
          .bg-white {
            background: white !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}

export default AmericanBusinessTemplate
