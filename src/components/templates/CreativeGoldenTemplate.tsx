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
}

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const CreativeGoldenTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates, skillsSummary } = resumeData

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

  // 技能展示组件
  const SkillsSection = () => (
    <section style={{ marginBottom: '25px' }}>
      <h2 style={{ 
        fontSize: '12px', 
        fontWeight: 'bold', 
        color: '#d97706',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ fontSize: '8px' }}>○</span> 技能专长 <span style={{ fontSize: '8px' }}>○</span>
      </h2>
      
      {Object.entries(skillGroups).map(([category, categorySkills], index) => (
        <div key={category} style={{ 
          marginBottom: index < Object.keys(skillGroups).length - 1 ? '15px' : '0' 
        }}>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '6px'
          }}>
            {category}：
          </div>
          {categorySkills.map((skill, skillIndex) => (
            <div key={skillIndex} style={{ 
              fontSize: '10px',
              color: '#4b5563',
              lineHeight: '1.5',
              marginBottom: '3px',
              paddingLeft: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '4px'
            }}>
              <span style={{ color: '#d97706' }}>•</span>
              <span>
                <strong>{skill.name}</strong>
                {skill.description && <span>：{skill.description}</span>}
              </span>
            </div>
          ))}
        </div>
      ))}
    </section>
  )

  // 教育背景组件
  const EducationSection = () => (
    <section>
      <h2 style={{ 
        fontSize: hasWorkOrProjects ? '12px' : '14px', 
        fontWeight: 'bold', 
        color: '#d97706',
        marginBottom: hasWorkOrProjects ? '10px' : '12px',
        display: hasWorkOrProjects ? 'flex' : 'block',
        alignItems: 'center',
        gap: '6px'
      }}>
        {hasWorkOrProjects && <span style={{ fontSize: '8px' }}>○</span>} 
        教育背景 
        {hasWorkOrProjects && <span style={{ fontSize: '8px' }}>○</span>}
      </h2>
      
      {education && education.length > 0 ? (
        education.map((edu) => (
          <div key={edu.id} style={{ 
            marginBottom: '12px',
            paddingLeft: hasWorkOrProjects ? '0' : '20px',
            borderLeft: hasWorkOrProjects ? 'none' : '3px solid #fbbf24'
          }}>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: 'bold',
              color: '#111827'
            }}>
              {edu.school}
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: '#6b7280'
            }}>
              {personalInfo.location?.split(',')[0] || '城市'}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#374151',
              marginTop: '2px'
            }}>
              {edu.degree} - {edu.major}
            </div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 'bold',
              color: '#111827',
              marginTop: '2px'
            }}>
              {edu.duration}
            </div>
            {edu.gpa && (
              <div style={{ 
                fontSize: '10px',
                color: '#6b7280',
                marginTop: '2px'
              }}>
                GPA: {edu.gpa}
              </div>
            )}
            {edu.description && (
              <div style={{ 
                fontSize: '10px',
                color: '#6b7280',
                marginTop: '4px',
                lineHeight: '1.4'
              }}>
                {edu.description}
              </div>
            )}
          </div>
        ))
      ) : (
        <div style={{ 
          fontSize: '11px',
          color: '#6b7280',
          fontStyle: 'italic',
          paddingLeft: hasWorkOrProjects ? '0' : '20px'
        }}>
          教育背景信息待补充
        </div>
      )}
    </section>
  )

  return (
    <div className="bg-white text-black max-w-[210mm] mx-auto" 
         style={{ 
           fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "微软雅黑", Arial, sans-serif',
           fontSize: '11px',
           lineHeight: '1.5',
           minHeight: '297mm',
           display: 'flex'
         }}>
      
      {/* 左侧边栏 */}
      <div style={{ 
        width: '35%',
        backgroundColor: '#f9fafb',
        padding: '30px 20px'
      }}>
        {/* 姓名和职位 */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            marginBottom: '4px',
            color: '#111827'
          }}>
            {personalInfo.name || '姓名'}
          </h1>
          <div style={{ 
            fontSize: '12px', 
            color: '#4b5563'
          }}>
            {personalInfo.title || '职位名称'}
          </div>
        </div>

        {/* 联系信息 */}
        <div style={{ 
          fontSize: '10px',
          color: '#6b7280',
          marginBottom: '25px',
          lineHeight: '1.8'
        }}>
          {personalInfo.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: '#d97706' }}>📍</span>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: '#d97706' }}>📞</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: '#d97706' }}>✉️</span>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#d97706' }}>🔗</span>
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* 动态内容：有工作/项目时显示技能，无工作/项目时显示教育 */}
        {hasWorkOrProjects ? (
          <>
            {/* 技能在左侧 */}
            {Object.keys(skillGroups).length > 0 && <SkillsSection />}
            
            {/* 证书认证在左侧 */}
            {certificates && certificates.length > 0 && (
              <section style={{ marginBottom: '25px' }}>
                <h2 style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  color: '#d97706',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '8px' }}>○</span> 证书认证 <span style={{ fontSize: '8px' }}>○</span>
                </h2>
                {certificates.map((cert) => (
                  <div key={cert.id} style={{ marginBottom: '12px' }}>
                    <div style={{ 
                      fontSize: '11px', 
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '2px'
                    }}>
                      {cert.name}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      color: '#4b5563',
                      marginBottom: '2px'
                    }}>
                      {cert.issuer}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#111827'
                    }}>
                      {cert.date}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </>
        ) : (
          /* 无工作/项目时，教育背景在左侧 */
          <EducationSection />
        )}
      </div>

      {/* 右侧主内容区 */}
      <div style={{ 
        flex: 1,
        padding: '30px 30px'
      }}>
        {/* 个人总结 */}
        {(skillsSummary || personalInfo.summary) && (
          <section style={{ marginBottom: '25px' }}>
            <h2 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: '#d97706',
              marginBottom: '10px'
            }}>
              个人总结
            </h2>
            <div style={{ 
              fontSize: '11px', 
              lineHeight: '1.6',
              color: '#374151',
              paddingLeft: '20px',
              borderLeft: '3px solid #fbbf24'
            }}>
              {skillsSummary || personalInfo.summary}
            </div>
          </section>
        )}

        {/* 工作经历 - 只在有数据时显示 */}
        {experience && experience.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h2 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: '#d97706',
              marginBottom: '12px'
            }}>
              工作经历
            </h2>
            
            {experience.map((exp, index) => (
              <div key={exp.id} style={{ 
                marginBottom: index < experience.length - 1 ? '20px' : '0',
                paddingLeft: '20px',
                borderLeft: '3px solid #fbbf24'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    color: '#111827'
                  }}>
                    {exp.company}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#4b5563'
                  }}>
                    {exp.position}
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#6b7280'
                  }}>
                    {personalInfo.location?.split(',')[0] || '城市'}
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    fontWeight: 'bold',
                    color: '#111827',
                    marginTop: '2px'
                  }}>
                    {exp.duration}
                  </div>
                </div>
                
                <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                  {exp.description && (
                    <li style={{ 
                      fontSize: '10px',
                      color: '#374151',
                      lineHeight: '1.5',
                      marginBottom: '4px',
                      paddingLeft: '12px',
                      position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: '#d97706' }}>•</span>
                      {exp.description}
                    </li>
                  )}
                  {exp.achievements && exp.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} style={{ 
                      fontSize: '10px',
                      color: '#374151',
                      lineHeight: '1.5',
                      marginBottom: '4px',
                      paddingLeft: '12px',
                      position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: '#d97706' }}>•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* 项目经历 */}
        {projects && projects.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h2 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: '#d97706',
              marginBottom: '12px'
            }}>
              项目经历
            </h2>
            
            {projects.map((project, index) => (
              <div key={project.id} style={{ 
                marginBottom: index < projects.length - 1 ? '16px' : '0',
                paddingLeft: '20px',
                borderLeft: '3px solid #fbbf24'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '2px'
                }}>
                  {project.name}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#4b5563',
                  marginBottom: '4px'
                }}>
                  {project.role}
                </div>
                <div style={{ 
                  fontSize: '10px',
                  color: '#374151',
                  lineHeight: '1.4',
                  marginBottom: '4px'
                }}>
                  {project.description}
                </div>
                {project.technologies && (
                  <div style={{ 
                    fontSize: '10px',
                    color: '#6b7280'
                  }}>
                    <strong>技术栈：</strong> {project.technologies}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 动态内容：有工作/项目时显示教育，无工作/项目时显示技能 */}
        {hasWorkOrProjects ? (
          /* 有工作/项目时，教育背景在右侧 */
          <EducationSection />
        ) : (
          /* 无工作/项目时，技能在右侧 */
          Object.keys(skillGroups).length > 0 && <SkillsSection />
        )}
      </div>

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

export default CreativeGoldenTemplate
