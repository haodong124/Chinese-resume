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

  // 技能分组
  const getSkillsByCategory = () => {
    const categorized = {
      webTech: [] as string[],
      frameworks: [] as string[],
      tools: [] as string[]
    }
    
    if (skills && skills.length > 0) {
      skills.forEach(skill => {
        if (skill.category?.includes('技术') || 
            skill.category?.includes('语言') ||
            skill.category?.includes('前端')) {
          categorized.webTech.push(skill.name)
        } else if (skill.category?.includes('框架') || 
                   skill.category?.includes('库')) {
          categorized.frameworks.push(skill.name)
        } else {
          categorized.tools.push(skill.name)
        }
      })
    }
    
    return categorized
  }

  const skillCategories = getSkillsByCategory()

  // 获取技能等级
  const getSkillLevel = (category: string) => {
    if (!skills || skills.length === 0) return '熟练'
    
    const categorySkills = skills.filter(skill => {
      if (category === 'webTech') {
        return skill.category?.includes('技术') || skill.category?.includes('语言')
      } else if (category === 'frameworks') {
        return skill.category?.includes('框架')
      } else {
        return true
      }
    })
    
    if (categorySkills.length === 0) return '熟练'
    
    const hasExpert = categorySkills.some(s => s.level === 'expert')
    const hasProficient = categorySkills.some(s => s.level === 'proficient')
    
    if (hasExpert) return '精通'
    if (hasProficient) return '熟练'
    return '了解'
  }

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
        {/* 头像占位区域 */}
        <div style={{ 
          width: '120px',
          height: '120px',
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '4px' }}>👤</div>
            <div style={{ fontSize: '10px' }}>照片</div>
          </div>
        </div>

        {/* 姓名和职位 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ color: '#d97706' }}>📍</span>
            <span>{personalInfo.location || '城市, 省份'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ color: '#d97706' }}>📞</span>
            <span>{personalInfo.phone || '138-xxxx-xxxx'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ color: '#d97706' }}>✉️</span>
            <span>{personalInfo.email || 'email@example.com'}</span>
          </div>
          {personalInfo.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#d97706' }}>🔗</span>
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* 个人资料 部分 */}
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
            <span style={{ fontSize: '8px' }}>○</span> 个人资料 <span style={{ fontSize: '8px' }}>○</span>
          </h2>
          <div style={{ fontSize: '10px', color: '#4b5563' }}>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ color: '#0077b5', fontWeight: 'bold' }}>in</span>
                <span>{personalInfo.name || 'johndoe'}</span>
              </div>
              <div style={{ paddingLeft: '22px', fontSize: '9px', color: '#6b7280' }}>
                LinkedIn
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '12px' }}>🐙</span>
                <span>{personalInfo.name || 'johndoe'}</span>
              </div>
              <div style={{ paddingLeft: '22px', fontSize: '9px', color: '#6b7280' }}>
                GitHub
              </div>
            </div>
          </div>
        </section>

        {/* 技能 部分 */}
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
            <span style={{ fontSize: '8px' }}>○</span> 技能 <span style={{ fontSize: '8px' }}>○</span>
          </h2>
          
          {/* Web技术 */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '2px'
            }}>
              Web技术
            </div>
            <div style={{ 
              fontSize: '9px',
              color: '#6b7280',
              marginBottom: '4px',
              textAlign: 'center'
            }}>
              {getSkillLevel('webTech')}
            </div>
            <div style={{ 
              fontSize: '10px',
              color: '#4b5563',
              lineHeight: '1.4',
              textAlign: 'center'
            }}>
              {skillCategories.webTech.length > 0 ? skillCategories.webTech.join(', ') : 'HTML5, JavaScript, PHP, Python'}
            </div>
          </div>
          
          {/* Web框架 */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '2px'
            }}>
              Web框架
            </div>
            <div style={{ 
              fontSize: '9px',
              color: '#6b7280',
              marginBottom: '4px',
              textAlign: 'center'
            }}>
              {getSkillLevel('frameworks')}
            </div>
            <div style={{ 
              fontSize: '10px',
              color: '#4b5563',
              lineHeight: '1.4',
              textAlign: 'center'
            }}>
              {skillCategories.frameworks.length > 0 ? skillCategories.frameworks.join(', ') : 'React.js, Angular, Vue.js, Laravel, Django'}
            </div>
          </div>
          
          {/* 工具 */}
          <div>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '2px'
            }}>
              工具
            </div>
            <div style={{ 
              fontSize: '9px',
              color: '#6b7280',
              marginBottom: '4px',
              textAlign: 'center'
            }}>
              {getSkillLevel('tools')}
            </div>
            <div style={{ 
              fontSize: '10px',
              color: '#4b5563',
              lineHeight: '1.4',
              textAlign: 'center'
            }}>
              {skillCategories.tools.length > 0 ? skillCategories.tools.join(', ') : 'Webpack, Git, Jenkins, Docker, JIRA'}
            </div>
          </div>
        </section>

        {/* 证书认证 部分 */}
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
              <div key={cert.id} style={{ marginBottom: '12px', textAlign: 'center' }}>
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

        {/* 项目 部分 */}
        {projects && projects.length > 0 && (
          <section>
            <h2 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: '#d97706',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '8px' }}>○</span> 项目 <span style={{ fontSize: '8px' }}>○</span>
            </h2>
            {projects.map((project) => (
              <div key={project.id} style={{ marginBottom: '12px', textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '2px'
                }}>
                  {project.name}
                </div>
                <div style={{ 
                  fontSize: '10px',
                  color: '#4b5563',
                  marginBottom: '4px'
                }}>
                  {project.role}
                </div>
                <div style={{ 
                  fontSize: '10px',
                  color: '#4b5563',
                  lineHeight: '1.4'
                }}>
                  {project.description}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* 右侧主内容区 */}
      <div style={{ 
        flex: 1,
        padding: '30px 30px'
      }}>
        {/* 个人总结 部分 */}
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
            {skillsSummary || personalInfo.summary || 
            `具有${experience?.length || 0}年工作经验的${personalInfo.title || '专业人士'}，专注于前端技术和用户体验设计。熟练掌握现代Web开发技术，对新技术保持敏锐的洞察力。具有良好的团队协作能力和项目管理经验，能够独立完成项目从概念到部署的全过程。`}
          </div>
        </section>

        {/* 工作经历 部分 */}
        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#d97706',
            marginBottom: '12px'
          }}>
            工作经历
          </h2>
          
          {experience && experience.length > 0 ? (
            experience.map((exp, index) => (
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
                
                {/* 工作描述 */}
                <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
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
                
                {/* 公司链接 */}
                {exp.company.includes('http') && (
                  <div style={{ 
                    fontSize: '10px',
                    color: '#d97706',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>🔗</span>
                    <span>{exp.company}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ 
              fontSize: '11px',
              color: '#6b7280',
              fontStyle: 'italic',
              paddingLeft: '20px'
            }}>
              期待获得相关工作机会
            </div>
          )}
        </section>

        {/* 教育背景 部分 */}
        <section>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#d97706',
            marginBottom: '12px'
          }}>
            教育背景
          </h2>
          
          {education && education.length > 0 ? (
            education.map((edu) => (
              <div key={edu.id} style={{ 
                paddingLeft: '20px',
                borderLeft: '3px solid #fbbf24'
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
              </div>
            ))
          ) : (
            <div style={{ 
              fontSize: '11px',
              color: '#6b7280',
              fontStyle: 'italic',
              paddingLeft: '20px'
            }}>
              教育背景信息待补充
            </div>
          )}
        </section>
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
