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

const StandardTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates, skillsSummary, achievements, languages } = resumeData

  // 智能生成默认技能总结
  const generateDefaultSummary = () => {
    if (skillsSummary || personalInfo.summary) {
      return skillsSummary || personalInfo.summary
    }
    
    // 根据填写的信息智能生成总结
    const yearsOfExp = experience?.length || 0
    const eduLevel = education?.[0]?.degree || '本科'
    const skillCount = skills?.length || 0
    
    if (yearsOfExp > 0) {
      return `具有${yearsOfExp}段工作经历的${personalInfo.title || '专业人士'}，${eduLevel}学历，掌握${skillCount > 0 ? skillCount + '项' : '多项'}专业技能，致力于在职业发展中不断提升自我。`
    } else if (education?.length > 0) {
      return `${eduLevel}${education[0].major || '专业'}毕业生，具备扎实的理论基础${skillCount > 0 ? `和${skillCount}项专业技能` : ''}，期待在实践中发挥所学知识。`
    } else {
      return `积极进取的${personalInfo.title || '求职者'}，具备良好的学习能力和适应能力，期待在新的工作岗位上展现自己的价值。`
    }
  }

  // 智能生成默认成就
  const generateDefaultAchievements = () => {
    if (achievements && achievements.length > 0) {
      return achievements
    }
    
    const defaultAchievements = []
    
    // 基于教育背景生成成就
    if (education?.length > 0 && education[0].gpa) {
      defaultAchievements.push({
        id: 'default-1',
        title: '学业成绩',
        description: `在${education[0].school}期间保持优秀的学业成绩，GPA达到${education[0].gpa}`,
        type: 'education' as const,
        date: education[0].duration
      })
    }
    
    // 基于项目经历生成成就
    if (projects?.length > 0) {
      defaultAchievements.push({
        id: 'default-2',
        title: '项目经验',
        description: `成功参与${projects.length}个项目的开发与实施，积累了丰富的实践经验`,
        type: 'project' as const,
        date: ''
      })
    }
    
    // 基于技能生成成就
    if (skills?.length >= 5) {
      defaultAchievements.push({
        id: 'default-3',
        title: '技能储备',
        description: `掌握${skills.length}项专业技能，具备综合性的技术能力和知识储备`,
        type: 'other' as const,
        date: ''
      })
    }
    
    // 如果没有任何可生成的成就，返回通用成就
    if (defaultAchievements.length === 0) {
      defaultAchievements.push(
        {
          id: 'default-1',
          title: '持续学习',
          description: '保持对新技术和行业动态的关注，不断提升专业能力',
          type: 'other' as const,
          date: ''
        },
        {
          id: 'default-2',
          title: '团队协作',
          description: '具备良好的团队合作精神和沟通能力',
          type: 'other' as const,
          date: ''
        }
      )
    }
    
    return defaultAchievements
  }

  // 将技能按类别分组并转换为标准格式
  const formatSkillsForDisplay = () => {
    // 如果用户没有填写技能，生成默认技能
    if (!skills || skills.length === 0) {
      // 基于职位和教育背景智能生成默认技能
      const defaultSkills: Record<string, string[]> = {}
      
      if (personalInfo.title?.includes('开发') || personalInfo.title?.includes('工程师')) {
        defaultSkills['技术技能'] = ['编程语言：熟悉主流开发语言', '开发工具：掌握常用开发环境']
        defaultSkills['软技能'] = ['问题解决：具备独立分析和解决问题的能力', '学习能力：快速学习新技术和工具']
      } else if (personalInfo.title?.includes('设计')) {
        defaultSkills['设计技能'] = ['设计软件：熟练使用设计工具', '创意思维：具备创新设计理念']
        defaultSkills['软技能'] = ['审美能力：良好的视觉审美', '沟通协作：与团队有效配合']
      } else {
        defaultSkills['专业技能'] = ['办公软件：熟练使用Office套件', '数据分析：基本的数据处理能力']
        defaultSkills['通用技能'] = ['沟通表达：良好的口头和书面表达能力', '时间管理：能够有效安排工作优先级']
      }
      
      return defaultSkills
    }
    
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

  // 生成默认语言能力
  const getDisplayLanguages = () => {
    if (languages && languages.length > 0) {
      return languages
    }
    
    // 返回默认的中英文语言能力
    return [
      {
        id: 'default-1',
        name: '中文',
        level: '母语',
        description: '流利的口语和书面表达'
      },
      {
        id: 'default-2',
        name: '英文',
        level: '良好',
        description: '能够进行日常交流和阅读专业文献'
      }
    ]
  }

  const skillGroups = formatSkillsForDisplay()
  const skillCategories = Object.keys(skillGroups)
  const leftColumnSkills = skillCategories.slice(0, Math.ceil(skillCategories.length / 2))
  const rightColumnSkills = skillCategories.slice(Math.ceil(skillCategories.length / 2))
  const displayAchievements = generateDefaultAchievements()
  const displayLanguages = getDisplayLanguages()

  return (
    <div className="bg-white text-black max-w-[210mm] mx-auto" 
         style={{ 
           fontFamily: 'Times, "Times New Roman", serif',
           fontSize: '11px',
           lineHeight: '1.4',
           minHeight: '297mm',
           padding: '15mm'
         }}>
      
      {/* 头部：姓名和联系方式 */}
      <div className="text-center mb-6">
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          letterSpacing: '1px',
          color: '#000000'
        }}>
          {personalInfo.name || '您的姓名'}
        </h1>
        <div style={{ 
          fontSize: '10px', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '16px',
          flexWrap: 'wrap',
          color: '#374151'
        }}>
          <span>{personalInfo.location || '城市, 省份'}</span>
          <span>{personalInfo.phone || '138-xxxx-xxxx'}</span>
          <span>{personalInfo.email || 'your.email@example.com'}</span>
        </div>
      </div>

      {/* 个人能力总结 - 始终显示 */}
      <section style={{ marginBottom: '16px' }}>
        <h2 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px',
          paddingBottom: '4px',
          borderBottom: '1px solid #e5e7eb',
          color: '#000000'
        }}>
          个人能力总结
        </h2>
        <div style={{ 
          fontSize: '11px', 
          lineHeight: '1.6',
          color: '#1f2937'
        }}>
          {generateDefaultSummary()}
        </div>
      </section>

      {/* 主要成就 - 始终显示 */}
      <section style={{ marginBottom: '16px' }}>
        <h2 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px',
          paddingBottom: '4px',
          borderBottom: '1px solid #e5e7eb',
          color: '#000000'
        }}>
          主要成就
        </h2>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '0',
          listStyle: 'none'
        }}>
          {displayAchievements.map((achievement) => (
            <li key={achievement.id} style={{ 
              fontSize: '11px',
              marginBottom: '4px',
              position: 'relative',
              paddingLeft: '8px',
              lineHeight: '1.5',
              color: '#1f2937'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                fontWeight: 'bold',
                color: '#000000'
              }}>•</span>
              {achievement.description}
            </li>
          ))}
        </ul>
      </section>

      {/* 技能专长 - 始终显示 */}
      <section style={{ marginBottom: '16px' }}>
        <h2 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px',
          paddingBottom: '4px',
          borderBottom: '1px solid #e5e7eb',
          color: '#000000'
        }}>
          技能专长
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '24px'
        }}>
          {/* 左栏技能 */}
          <div>
            {leftColumnSkills.map((category) => (
              <div key={category} style={{ marginBottom: '8px' }}>
                <div style={{ 
                  fontWeight: '600', 
                  fontSize: '11px',
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {category}：
                </div>
                {skillGroups[category].map((skill, index) => (
                  <div key={index} style={{ 
                    fontSize: '11px',
                    color: '#1f2937',
                    marginBottom: '2px',
                    lineHeight: '1.3'
                  }}>
                    {skill}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* 右栏技能 */}
          <div>
            {rightColumnSkills.map((category) => (
              <div key={category} style={{ marginBottom: '8px' }}>
                <div style={{ 
                  fontWeight: '600', 
                  fontSize: '11px',
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {category}：
                </div>
                {skillGroups[category].map((skill, index) => (
                  <div key={index} style={{ 
                    fontSize: '11px',
                    color: '#1f2937',
                    marginBottom: '2px',
                    lineHeight: '1.3'
                  }}>
                    {skill}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 工作经历 - 有数据才显示 */}
      {experience && experience.length > 0 ? (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
            paddingBottom: '4px',
            borderBottom: '1px solid #e5e7eb',
            color: '#000000'
          }}>
            工作经历
          </h2>
          <div>
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
                      fontWeight: '600', 
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      color: '#111827'
                    }}>
                      {exp.position} | {exp.duration}
                    </div>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '11px',
                      color: '#1f2937'
                    }}>
                      {exp.company} - {personalInfo.location?.split(',').pop()?.trim() || 'China'}
                    </div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: '0',
                    listStyle: 'none'
                  }}>
                    <li style={{ 
                      fontSize: '11px',
                      marginBottom: '4px',
                      position: 'relative',
                      paddingLeft: '8px',
                      lineHeight: '1.4',
                      color: '#1f2937'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        fontWeight: 'bold',
                        color: '#000000'
                      }}>•</span>
                      {exp.description}
                    </li>
                    
                    {exp.achievements && exp.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} style={{ 
                        fontSize: '11px',
                        marginBottom: '4px',
                        position: 'relative',
                        paddingLeft: '8px',
                        lineHeight: '1.4',
                        color: '#1f2937'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          fontWeight: 'bold',
                          color: '#000000'
                        }}>•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        // 如果没有工作经历，显示项目经历
        projects && projects.length > 0 && (
          <section style={{ marginBottom: '16px' }}>
            <h2 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              paddingBottom: '4px',
              borderBottom: '1px solid #e5e7eb',
              color: '#000000'
            }}>
              项目经历
            </h2>
            <div>
              {projects.map((project, index) => (
                <div key={project.id} style={{ marginBottom: index < projects.length - 1 ? '12px' : '0' }}>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '11px',
                    color: '#111827'
                  }}>
                    {project.name} - {project.role}
                  </div>
                  <div style={{ 
                    fontSize: '11px',
                    color: '#1f2937',
                    marginTop: '2px'
                  }}>
                    {project.description}
                  </div>
                  {project.technologies && (
                    <div style={{ 
                      fontSize: '10px',
                      color: '#374151',
                      marginTop: '2px'
                    }}>
                      技术栈：{project.technologies}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      )}

      {/* 教育背景 - 始终显示 */}
      <section style={{ marginBottom: '16px' }}>
        <h2 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px',
          paddingBottom: '4px',
          borderBottom: '1px solid #e5e7eb',
          color: '#000000'
        }}>
          教育背景
        </h2>
        <div>
          {education && education.length > 0 ? (
            education.map((edu, index) => (
              <div key={edu.id} style={{ marginBottom: index < education.length - 1 ? '12px' : '0' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '11px',
                      color: '#111827'
                    }}>
                      {edu.school} - {personalInfo.location || '所在地'} | {edu.degree}
                    </div>
                    <div style={{ 
                      fontSize: '11px',
                      color: '#1f2937'
                    }}>
                      {edu.major}，{edu.duration}
                    </div>
                  </div>
                </div>
                {edu.description && (
                  <div style={{ 
                    fontSize: '11px',
                    marginTop: '4px',
                    color: '#374151'
                  }}>
                    {edu.description}
                  </div>
                )}
                {edu.gpa && (
                  <div style={{ 
                    fontSize: '11px',
                    marginTop: '2px',
                    color: '#374151'
                  }}>
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ 
              fontSize: '11px',
              color: '#374151',
              fontStyle: 'italic'
            }}>
              教育背景信息待补充
            </div>
          )}
        </div>
      </section>

      {/* 证书认证 - 如果有才显示 */}
      {certificates && certificates.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
            paddingBottom: '4px',
            borderBottom: '1px solid #e5e7eb',
            color: '#000000'
          }}>
            证书认证
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: certificates.length > 2 ? '1fr 1fr' : '1fr', 
            gap: '12px'
          }}>
            {certificates.map((cert) => (
              <div key={cert.id}>
                <div style={{ 
                  fontWeight: '600', 
                  fontSize: '11px',
                  color: '#111827'
                }}>
                  {cert.name}
                </div>
                <div style={{ 
                  fontSize: '11px',
                  color: '#1f2937'
                }}>
                  {cert.issuer} - {cert.date}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 语言能力 - 始终显示 */}
      <section>
        <h2 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px',
          paddingBottom: '4px',
          borderBottom: '1px solid #e5e7eb',
          color: '#000000'
        }}>
          语言能力
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: displayLanguages.length > 2 ? '1fr 1fr' : '1fr', 
          gap: '24px'
        }}>
          {displayLanguages.map((language) => (
            <div key={language.id}>
              <div style={{ 
                fontWeight: '600', 
                fontSize: '11px',
                color: '#111827'
              }}>
                {language.name}
              </div>
              <div style={{ 
                fontSize: '11px',
                color: '#1f2937'
              }}>
                {language.level}
                {language.description && (
                  <span style={{ marginLeft: '8px', fontStyle: 'italic', color: '#374151' }}>
                    ({language.description})
                  </span>
                )}
              </div>
            </div>
          ))}
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
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}

export default StandardTemplate
