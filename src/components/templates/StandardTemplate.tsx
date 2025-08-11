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

  // 将技能按类别分组并转换为标准格式
  const formatSkillsForDisplay = () => {
    if (!skills || skills.length === 0) return {}
    
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category || '其他技能'
      if (!acc[category]) acc[category] = []
      
      // 格式化技能名称：如果有描述就显示描述，否则显示技能名
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
  
  // 将技能分为两栏
  const leftColumnSkills = skillCategories.slice(0, Math.ceil(skillCategories.length / 2))
  const rightColumnSkills = skillCategories.slice(Math.ceil(skillCategories.length / 2))

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
          {personalInfo.name}
        </h1>
        <div style={{ 
          fontSize: '10px', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '16px',
          flexWrap: 'wrap',
          color: '#374151'
        }}>
          <span>{personalInfo.location}</span>
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.email}</span>
        </div>
      </div>

      {/* 专业技能总结 - 单栏全宽 */}
      {(skillsSummary || personalInfo.summary) && (
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
            {skillsSummary || personalInfo.summary}
          </div>
        </section>
      )}

      {/* 主要成就 - 单栏全宽，成就亮点 */}
      {achievements && achievements.length > 0 && (
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
            {achievements.map((achievement, index) => (
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
      )}

      {/* 技能专长 - 双栏布局 */}
      {skillCategories.length > 0 && (
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
      )}

      {/* 工作经历 - 单栏全宽 */}
      {experience.length > 0 && (
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
                
                {/* 工作描述和成就 */}
                <div style={{ marginBottom: '8px' }}>
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: '0',
                    listStyle: 'none'
                  }}>
                    {/* 主要工作描述 */}
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
                    
                    {/* 成就列表 */}
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
      )}

      {/* 教育背景 - 单栏全宽 */}
      {education.length > 0 && (
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
            {education.map((edu, index) => (
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
                      {edu.school} - {personalInfo.location} | {edu.degree}
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
            ))}
          </div>
        </section>
      )}

      {/* 语言能力 - 动态显示用户填写的语言 */}
      {languages && languages.length > 0 ? (
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
            gridTemplateColumns: languages.length > 2 ? '1fr 1fr' : '1fr', 
            gap: '24px'
          }}>
            {languages.map((language) => (
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
      ) : (
        // 如果没有填写语言，显示默认提示
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
            fontSize: '11px',
            color: '#374151',
            fontStyle: 'italic'
          }}>
            未填写语言信息
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
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}

export default StandardTemplate
