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

  // 解析项目描述中的成就
  const parseProjectDescription = (description: string) => {
    if (description.includes('项目成就：')) {
      const parts = description.split('项目成就：')
      const mainDescription = parts[0].trim()
      const achievementsText = parts[1]
      
      const achievementsList = achievementsText
        .split(/\d+\./)
        .filter(item => item.trim())
        .map(item => item.trim())
      
      return {
        mainDescription,
        achievements: achievementsList
      }
    }
    
    return {
      mainDescription: description,
      achievements: []
    }
  }

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

      {/* Projects 部分 - 优化版 */}
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
          
          {projects.map((project, index) => {
            const { mainDescription, achievements } = parseProjectDescription(project.description)
            
            return (
              <div key={project.id} style={{ marginBottom: index < projects.length - 1 ? '16px' : '0' }}>
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
                        {project.name}
                      </span>
                    </div>
                    {project.duration && (
                      <div style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold',
                        color: '#000'
                      }}>
                        {project.duration}
                      </div>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#333',
                    marginTop: '2px'
                  }}>
                    {project.role}
                  </div>
                </div>
                
                <div style={{ paddingLeft: '20px' }}>
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
                    <span>{mainDescription}</span>
                  </div>
                  
                  {achievements.map((achievement, achIndex) => (
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
                  
                  {project.technologies && (
                    <div style={{ 
                      fontSize: '10px',
                      color: '#666',
                      marginTop: '4px'
                    }}>
                      <strong>Technologies:</strong> {project.technologies}
                    </div>
                  )}
                  
                  {project.link && (
                    <div style={{ 
                      fontSize: '10px',
                      color: '#dc2626',
                      marginTop: '2px'
                    }}>
                      {project.link}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
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

      {/* Skills 部分保持不变 */}
      {/* ... 其余代码保持不变 ... */}
      
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
