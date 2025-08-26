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

const EuropassStyleTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates, achievements, languages, skillsSummary } = resumeData

  // 技能按类别分组
  const formatSkillsForDisplay = () => {
    if (!skills || skills.length === 0) return {}
    
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category || '专业技能'
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
        width: '32%',
        backgroundColor: '#ffffff',
        padding: '20px 15px',
        borderRight: '1px solid #e0e0e0'
      }}>
        {/* Logo区域 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <div style={{ 
              width: '30px', 
              height: '30px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>简</span>
            </div>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: 'bold',
              color: '#4a90e2'
            }}>专业简历</span>
          </div>
        </div>

        {/* 个人信息标题 */}
        <div style={{ 
          fontSize: '11px',
          color: '#4a90e2',
          marginBottom: '15px',
          fontWeight: 'bold'
        }}>
          个人信息
        </div>

        {/* 基本信息 */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ 
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px'
          }}>
            {personalInfo.name || '姓名'}
          </div>
          <div style={{ 
            fontSize: '12px',
            color: '#666',
            marginBottom: '12px'
          }}>
            {personalInfo.title || '职位名称'}
          </div>
          <div style={{ fontSize: '10px', color: '#666', lineHeight: '1.8' }}>
            <div style={{ marginBottom: '4px' }}>
              📍 {personalInfo.location || '城市, 省份'}
            </div>
            <div style={{ marginBottom: '4px' }}>
              📞 {personalInfo.phone || '138-xxxx-xxxx'}
            </div>
            <div style={{ marginBottom: '4px' }}>
              ✉️ {personalInfo.email || 'email@example.com'}
            </div>
            {personalInfo.website && (
              <div>
                🌐 {personalInfo.website}
              </div>
            )}
          </div>
        </div>

        {/* 技能专长 */}
        {Object.keys(skillGroups).length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <div style={{ 
              fontSize: '11px',
              color: '#4a90e2',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              技能专长
            </div>
            {Object.entries(skillGroups).map(([category, categorySkills], index) => (
              <div key={category} style={{ marginBottom: index < Object.keys(skillGroups).length - 1 ? '12px' : '0' }}>
                <div style={{ 
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '4px'
                }}>
                  {category}
                </div>
                <div style={{ 
                  fontSize: '9px',
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  {categorySkills.join('、')}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 语言能力 */}
        {languages && languages.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <div style={{ 
              fontSize: '11px',
              color: '#4a90e2',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              语言能力
            </div>
            {languages.map((language, index) => (
              <div key={language.id} style={{ 
                marginBottom: index < languages.length - 1 ? '8px' : '0',
                fontSize: '10px'
              }}>
                <span style={{ fontWeight: 'bold', color: '#333' }}>{language.name}</span>
                <span style={{ color: '#666', marginLeft: '8px' }}>{language.level}</span>
                {language.description && (
                  <div style={{ fontSize: '9px', color: '#999', marginTop: '2px' }}>
                    {language.description}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 证书认证 */}
        {certificates && certificates.length > 0 && (
          <section>
            <div style={{ 
              fontSize: '11px',
              color: '#4a90e2',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              证书认证
            </div>
            {certificates.map((cert, index) => (
              <div key={cert.id} style={{ 
                marginBottom: index < certificates.length - 1 ? '8px' : '0',
                fontSize: '9px'
              }}>
                <div style={{ fontWeight: 'bold', color: '#333' }}>{cert.name}</div>
                <div style={{ color: '#666' }}>{cert.issuer}</div>
                <div style={{ color: '#999' }}>{cert.date}</div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* 右侧主内容区 */}
      <div style={{ 
        flex: 1,
        padding: '20px 30px'
      }}>
        {/* 顶部标题栏 */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '2px solid #4a90e2'
        }}>
          <div style={{ 
            fontSize: '11px',
            color: '#4a90e2'
          }}>
            个人简历
          </div>
          <div style={{ 
            fontSize: '14px',
            color: '#4a90e2',
            fontWeight: 'bold'
          }}>
            {personalInfo.name || '姓名'}
          </div>
        </div>

        {/* 个人总结 */}
        {(skillsSummary || personalInfo.summary) && (
          <section style={{ marginBottom: '25px' }}>
            <div style={{ 
              fontSize: '12px',
              color: '#4a90e2',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              个人总结
            </div>
            <div style={{ 
              fontSize: '11px',
              lineHeight: '1.6',
              color: '#333',
              backgroundColor: '#f8f9fa',
              padding: '12px',
              borderRadius: '4px'
            }}>
              {skillsSummary || personalInfo.summary}
            </div>
          </section>
        )}

        {/* 工作经历 */}
        {experience && experience.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <div style={{ 
              fontSize: '12px',
              color: '#4a90e2',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '4px',
              borderBottom: '2px solid #4a90e2'
            }}>
              工作经历
            </div>
            
            {experience.map((exp, index) => (
              <div key={exp.id} style={{ 
                marginBottom: index < experience.length - 1 ? '20px' : '0',
                display: 'flex',
                gap: '20px'
              }}>
                {/* 时间列 */}
                <div style={{ 
                  width: '110px',
                  fontSize: '10px',
                  color: '#4a90e2',
                  flexShrink: 0,
                  textAlign: 'right',
                  paddingTop: '2px'
                }}>
                  {exp.duration}
                </div>
                
                {/* 内容列 */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '2px'
                  }}>
                    {exp.company}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#666',
                    marginBottom: '2px'
                  }}>
                    {exp.position}
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#999',
                    marginBottom: '8px'
                  }}>
                    {personalInfo.location?.split(',')[0] || '城市'}
                  </div>
                  
                  {/* 工作内容 */}
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: '16px',
                    fontSize: '10px',
                    color: '#555',
                    lineHeight: '1.6'
                  }}>
                    <li style={{ marginBottom: '4px' }}>
                      {exp.description}
                    </li>
                    {exp.achievements && exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} style={{ marginBottom: '4px' }}>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 项目经历 */}
        {projects && projects.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <div style={{ 
              fontSize: '12px',
              color: '#4a90e2',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '4px',
              borderBottom: '2px solid #4a90e2'
            }}>
              项目经历
            </div>
            
            {projects.map((project, index) => (
              <div key={project.id} style={{ 
                marginBottom: index < projects.length - 1 ? '16px' : '0',
                display: 'flex',
                gap: '20px'
              }}>
                {/* 时间列 */}
                <div style={{ 
                  width: '110px',
                  fontSize: '10px',
                  color: '#4a90e2',
                  flexShrink: 0,
                  textAlign: 'right',
                  paddingTop: '2px'
                }}>
                  {project.duration || '项目时间'}
                </div>
                
                {/* 内容列 */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    color: '#333',
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
                    fontSize: '10px',
                    color: '#555',
                    lineHeight: '1.6',
                    marginBottom: '4px'
                  }}>
                    {project.description}
                  </div>
                  {project.technologies && (
                    <div style={{ 
                      fontSize: '10px',
                      color: '#777'
                    }}>
                      <strong>技术栈：</strong> {project.technologies}
                    </div>
                  )}
                  {project.link && (
                    <div style={{ 
                      fontSize: '10px',
                      color: '#4a90e2',
                      marginTop: '2px'
                    }}>
                      🔗 {project.link}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 教育背景 */}
        {education && education.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <div style={{ 
              fontSize: '12px',
              color: '#4a90e2',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '4px',
              borderBottom: '2px solid #4a90e2'
            }}>
              教育背景
            </div>
            
            {education.map((edu, index) => (
              <div key={edu.id} style={{ 
                marginBottom: index < education.length - 1 ? '16px' : '0',
                display: 'flex',
                gap: '20px'
              }}>
                {/* 时间列 */}
                <div style={{ 
                  width: '110px',
                  fontSize: '10px',
                  color: '#4a90e2',
                  flexShrink: 0,
                  textAlign: 'right',
                  paddingTop: '2px'
                }}>
                  {edu.duration}
                </div>
                
                {/* 内容列 */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '2px'
                  }}>
                    {edu.school}
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#999',
                    marginBottom: '4px'
                  }}>
                    {personalInfo.location?.split(',')[0] || '城市'}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#555'
                  }}>
                    {edu.degree} - {edu.major}
                  </div>
                  {edu.description && (
                    <div style={{ 
                      fontSize: '10px',
                      color: '#666',
                      marginTop: '4px',
                      lineHeight: '1.4'
                    }}>
                      {edu.description}
                    </div>
                  )}
                  {edu.gpa && (
                    <div style={{ 
                      fontSize: '10px',
                      color: '#777',
                      marginTop: '2px'
                    }}>
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 主要成就 */}
        {achievements && achievements.length > 0 && (
          <section>
            <div style={{ 
              fontSize: '12px',
              color: '#4a90e2',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '4px',
              borderBottom: '2px solid #4a90e2'
            }}>
              主要成就
            </div>
            
            <ul style={{ 
              margin: 0,
              paddingLeft: '16px',
              fontSize: '10px',
              color: '#555',
              lineHeight: '1.6'
            }}>
              {achievements.map((achievement) => (
                <li key={achievement.id} style={{ marginBottom: '4px' }}>
                  <strong>{achievement.title}</strong>
                  {achievement.description && <span>：{achievement.description}</span>}
                  {achievement.date && (
                    <span style={{ color: '#999', marginLeft: '8px' }}>
                      ({achievement.date})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
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

export default EuropassStyleTemplate
