import React from 'react'
import type { ResumeData } from '../ResumeEditor'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const AmericanBusinessTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates, achievements, languages } = resumeData

  // 判断是否有工作或项目经历
  const hasWorkOrProjects = (experience && experience.length > 0) || (projects && projects.length > 0)

  // 技能分组处理 - 改进版
  const formatSkillsForDisplay = () => {
    if (!skills || skills.length === 0) return {}
    
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category || '专业技能'
      if (!acc[category]) acc[category] = []
      
      acc[category].push({
        name: skill.name,
        description: skill.description || '',
        level: skill.level
      })
      return acc
    }, {} as Record<string, Array<{name: string, description: string, level: string}>>)

    return groupedSkills
  }

  const skillGroups = formatSkillsForDisplay()

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
        <div style={{ textAlign: 'center' }}>
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
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            {personalInfo.location && (
              <span>{personalInfo.location}</span>
            )}
            {personalInfo.phone && (
              <span style={{ color: '#dc2626' }}>{personalInfo.phone}</span>
            )}
            {personalInfo.email && (
              <span style={{ color: '#dc2626' }}>{personalInfo.email}</span>
            )}
            {personalInfo.website && (
              <span style={{ color: '#dc2626' }}>{personalInfo.website}</span>
            )}
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
            {personalInfo.summary || resumeData.skillsSummary}
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
                    {personalInfo.location?.split(',')[0] || '城市'}
                  </div>
                </div>
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
              {project.technologies && (
                <div style={{ 
                  fontSize: '10px',
                  color: '#666',
                  marginTop: '4px'
                }}>
                  <strong>Technologies:</strong> {project.technologies}
                </div>
              )}
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
                    {personalInfo.location?.split(',')[0] || '城市'}
                  </div>
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
              {edu.gpa && (
                <div style={{ 
                  fontSize: '10px',
                  color: '#666',
                  marginTop: '4px'
                }}>
                  GPA: {edu.gpa}
                </div>
              )}
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
          
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {certificates.map((cert) => (
              <div key={cert.id} style={{ flex: '1 1 45%' }}>
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

      {/* Skills 部分 - 动态列布局 */}
      {Object.keys(skillGroups).length > 0 && (
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
            gridTemplateColumns: hasWorkOrProjects ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            gap: hasWorkOrProjects ? '20px' : '30px'
          }}>
            {Object.entries(skillGroups).map(([category, categorySkills]) => (
              <div key={category}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  color: '#000',
                  marginBottom: '6px'
                }}>
                  {category}
                </div>
                
                {categorySkills.map((skill, skillIndex) => (
                  <div key={skillIndex} style={{ 
                    fontSize: '10px', 
                    color: '#333',
                    lineHeight: '1.5',
                    marginBottom: '3px',
                    paddingLeft: '8px',
                    position: 'relative'
                  }}>
                    <span style={{ 
                      position: 'absolute',
                      left: 0,
                      color: '#dc2626'
                    }}>•</span>
                    <span>
                      <strong>{skill.name}</strong>
                      {skill.description && <span>: {skill.description}</span>}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages 部分 */}
      {languages && languages.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: '#dc2626',
            marginBottom: '10px'
          }}>
            Languages
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          }}>
            {languages.map((language) => (
              <div key={language.id}>
                <span style={{ 
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#000'
                }}>
                  {language.name}
                </span>
                <span style={{ 
                  fontSize: '11px',
                  color: '#333',
                  marginLeft: '8px'
                }}>
                  - {language.level}
                </span>
                {language.description && (
                  <div style={{ 
                    fontSize: '10px',
                    color: '#666',
                    marginTop: '2px'
                  }}>
                    {language.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements 部分 - 只在有工作经验时显示 */}
      {hasWorkOrProjects && achievements && achievements.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: '#dc2626',
            marginBottom: '10px'
          }}>
            Achievements
          </h2>
          <div>
            {achievements.map((achievement, index) => (
              <div key={achievement.id} style={{ 
                fontSize: '11px',
                color: '#333',
                lineHeight: '1.5',
                marginBottom: index < achievements.length - 1 ? '6px' : '0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <span style={{ color: '#666' }}>•</span>
                <div>
                  <strong>{achievement.title}</strong>
                  {achievement.description && <span>: {achievement.description}</span>}
                  {achievement.date && (
                    <span style={{ color: '#666', fontSize: '10px', marginLeft: '8px' }}>
                      ({achievement.date})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
