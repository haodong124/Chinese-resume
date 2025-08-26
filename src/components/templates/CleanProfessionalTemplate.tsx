import React from 'react'
import type { ResumeData } from '../ResumeEditor'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const CleanProfessionalTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates, achievements, languages, skillsSummary } = resumeData

  // 技能按类别分组 - 改进版
  const formatSkillsForDisplay = () => {
    if (!skills || skills.length === 0) return {}
    
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category || 'Professional Skills'
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

  // 技能等级转换
  const getSkillLevelText = (level: string) => {
    const levelMap = {
      'understand': 'Basic',
      'proficient': 'Intermediate', 
      'expert': 'Advanced'
    }
    return levelMap[level as keyof typeof levelMap] || 'Intermediate'
  }

  // 判断是否有工作经验
  const hasWorkExperience = experience && experience.length > 0

  return (
    <div className="bg-white text-black max-w-[210mm] mx-auto" 
         style={{ 
           fontFamily: '"Helvetica Neue", Arial, sans-serif',
           fontSize: '11px',
           lineHeight: '1.4',
           minHeight: '297mm',
           padding: '20mm'
         }}>
      
      {/* 页眉 - 个人信息 */}
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: '#000',
          letterSpacing: '0.5px'
        }}>
          {personalInfo.name || '姓名'}
        </h1>
        
        {personalInfo.title && (
          <div style={{ 
            fontSize: '14px', 
            color: '#666',
            marginBottom: '12px',
            fontWeight: '500'
          }}>
            {personalInfo.title}
          </div>
        )}
        
        {/* 联系信息横向排列 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          flexWrap: 'wrap',
          fontSize: '10px',
          color: '#555'
        }}>
          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}
          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}
          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}
          {personalInfo.website && (
            <span>{personalInfo.website}</span>
          )}
        </div>
      </header>

      {/* 分割线 */}
      <div style={{ 
        borderBottom: '2px solid #e5e7eb', 
        marginBottom: '18px' 
      }}></div>

      {/* 个人简介/总结 */}
      {(skillsSummary || personalInfo.summary) && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#000',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Summary
          </h2>
          <div style={{ 
            fontSize: '11px', 
            lineHeight: '1.6',
            color: '#333',
            textAlign: 'justify'
          }}>
            {skillsSummary || personalInfo.summary}
          </div>
        </section>
      )}

      {/* 工作经历 */}
      {hasWorkExperience && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#000',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Experience
          </h2>
          
          {experience.map((exp, index) => (
            <div key={exp.id} style={{ marginBottom: index < experience.length - 1 ? '16px' : '0' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '4px'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    {exp.company}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#666',
                    fontWeight: '500'
                  }}>
                    {exp.position}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#666',
                  fontWeight: 'bold',
                  textAlign: 'right'
                }}>
                  {exp.duration}
                  <div>{personalInfo.location?.split(',').pop()?.trim() || ''}</div>
                </div>
              </div>
              
              <div style={{ paddingLeft: '12px' }}>
                {exp.description && (
                  <div style={{ 
                    fontSize: '11px',
                    color: '#333',
                    lineHeight: '1.5',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px'
                  }}>
                    <span style={{ color: '#666', fontSize: '8px', marginTop: '4px' }}>•</span>
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
                    gap: '6px'
                  }}>
                    <span style={{ color: '#666', fontSize: '8px', marginTop: '4px' }}>•</span>
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 教育背景 */}
      {education && education.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#000',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Education
          </h2>
          
          {education.map((edu, index) => (
            <div key={edu.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: index < education.length - 1 ? '12px' : '0'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  color: '#000'
                }}>
                  {edu.school}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#666',
                  marginBottom: '2px'
                }}>
                  {edu.major}
                </div>
                {edu.description && (
                  <div style={{ 
                    fontSize: '10px',
                    color: '#555',
                    marginTop: '4px',
                    lineHeight: '1.4'
                  }}>
                    {edu.description}
                  </div>
                )}
                {edu.gpa && (
                  <div style={{ 
                    fontSize: '10px',
                    color: '#555',
                    marginTop: '2px'
                  }}>
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>
              <div style={{ 
                textAlign: 'right',
                marginLeft: '20px'
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#666',
                  fontWeight: 'bold'
                }}>
                  {edu.duration}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#666'
                }}>
                  {edu.degree}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 项目经历 */}
      {projects && projects.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#000',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
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
                color: '#666',
                marginBottom: '4px'
              }}>
                {project.role}
              </div>
              <div style={{ 
                fontSize: '11px',
                color: '#333',
                lineHeight: '1.5',
                marginBottom: '4px'
              }}>
                {project.description}
              </div>
              {project.technologies && (
                <div style={{ 
                  fontSize: '10px',
                  color: '#555'
                }}>
                  <strong>Technologies:</strong> {project.technologies}
                </div>
              )}
              {project.link && (
                <div style={{ 
                  fontSize: '10px',
                  color: '#22c55e',
                  marginTop: '2px'
                }}>
                  {project.link}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 技能专长 - 改进的展示方式 */}
      {Object.keys(skillGroups).length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#000',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Skills
          </h2>
          
          {Object.entries(skillGroups).map(([category, categorySkills], categoryIndex) => (
            <div key={category} style={{ 
              marginBottom: categoryIndex < Object.keys(skillGroups).length - 1 ? '16px' : '0' 
            }}>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '8px'
              }}>
                {category}:
              </div>
              <div style={{ paddingLeft: '12px' }}>
                {categorySkills.map((skill, skillIndex) => (
                  <div key={skillIndex} style={{ 
                    fontSize: '11px',
                    color: '#333',
                    lineHeight: '1.6',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px'
                  }}>
                    <span style={{ color: '#666', fontSize: '8px', marginTop: '4px' }}>•</span>
                    <span>
                      <strong>{skill.name}</strong>
                      {skill.description && <span>: {skill.description}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 证书认证 */}
      {certificates && certificates.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#000',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Certifications
          </h2>
          
          {certificates.map((cert, index) => (
            <div key={cert.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: index < certificates.length - 1 ? '8px' : '0'
            }}>
              <div>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  color: '#000'
                }}>
                  {cert.name}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#666'
                }}>
                  {cert.issuer}
                </div>
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#666',
                fontWeight: 'bold'
              }}>
                {cert.date}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 语言能力 */}
      {languages && languages.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#000',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Languages
          </h2>
          
          {languages.map((language, index) => (
            <div key={language.id} style={{ 
              marginBottom: index < languages.length - 1 ? '6px' : '0',
              fontSize: '11px',
              color: '#333'
            }}>
              <strong>{language.name}</strong> - {language.level}
              {language.description && (
                <span style={{ color: '#666', marginLeft: '8px' }}>
                  ({language.description})
                </span>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 主要成就 - 只在有工作经验时显示 */}
      {hasWorkExperience && achievements && achievements.length > 0 && (
        <section>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#000',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
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
                gap: '6px'
              }}>
                <span style={{ color: '#666', fontSize: '8px', marginTop: '4px' }}>•</span>
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

export default CleanProfessionalTemplate
