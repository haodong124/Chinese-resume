import React from 'react';
import { ResumeData } from '../App';

// 导入新的模板组件
import StandardTemplate from './templates/StandardTemplate';
import EliteTemplate from './templates/EliteTemplate';
import ModernTimelineTemplate from './templates/ModernTimelineTemplate';
import MinimalBusinessTemplate from './templates/MinimalBusinessTemplate';
import CreativeDuoToneTemplate from './templates/CreativeDuoToneTemplate';

interface TemplateRendererProps {
  resumeData: ResumeData;
  templateName: string;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({ resumeData, templateName }) => {
  const { personalInfo, education, experience, projects, skills } = resumeData;
  
  // 处理技能数据 - 兼容旧格式和新格式
  const processSkills = () => {
    // 如果 skills 是字符串（旧格式）
    if (typeof skills === 'string') {
      const skillGroups = skills.split(',').map(skill => skill.trim()).filter(Boolean);
      return skillGroups.map((skill, index) => ({
        id: index.toString(),
        name: skill,
        level: 'proficient' as const,
        category: '专业技能',
        description: skill,
        capabilities: []
      }));
    }
    
    // 如果 skills 是数组（新格式）
    if (Array.isArray(skills)) {
      return skills;
    }
    
    return [];
  };

  // 数据适配器 - 将数据转换为新模板需要的格式
  const adaptDataForNewTemplates = (data: ResumeData) => {
    const processedSkills = processSkills();
    
    const adaptedData = {
      personalInfo: {
        name: data.personalInfo?.name || '',
        email: data.personalInfo?.email || '',
        phone: data.personalInfo?.phone || '',
        location: data.personalInfo?.location || '',
        title: data.personalInfo?.title || '',
        summary: data.personalInfo?.summary || '',
        website: data.personalInfo?.website || ''
      },
      education: (data.education || []).map(edu => ({
        ...edu,
        id: edu.id || Math.random().toString()
      })),
      experience: (data.experience || []).map(exp => ({
        ...exp,
        id: exp.id || Math.random().toString(),
        achievements: exp.achievements || []
      })),
      projects: (data.projects || []).map(proj => ({
        ...proj,
        id: proj.id || Math.random().toString()
      })),
      skills: processedSkills,
      certificates: [],
      skillsSummary: data.personalInfo?.summary || '',
      achievements: [],
      languages: [],
      industryAnalysis: undefined
    };

    return adaptedData;
  };

  // 新模板渲染函数
  const renderNewTemplate = (TemplateComponent: React.ComponentType<any>) => {
    const adaptedData = adaptDataForNewTemplates(resumeData);
    return <TemplateComponent resumeData={adaptedData} isPreview={true} />;
  };

  // 保留原有模板的渲染逻辑（用于向后兼容）
  const renderLegacyTemplates = () => {
    const skillGroups = typeof skills === 'string' 
      ? skills.split(',').map(skill => skill.trim()).filter(Boolean) 
      : [];

    switch (templateName) {
      case 'azurill':
        return (
          <div className="bg-white p-8 font-serif text-sm" style={{ fontFamily: 'Merriweather, serif', lineHeight: 1.75 }}>
            <div className="text-center mb-8 pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.name || 'John Doe'}</h1>
              <p className="text-lg text-blue-600 mb-4">专业人士</p>
              <div className="flex justify-center space-x-6 text-sm text-gray-600">
                {personalInfo.email && <span>📧 {personalInfo.email}</span>}
                {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                {personalInfo.location && <span>📍 {personalInfo.location}</span>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-6">
                {experience.length > 0 && (
                  <section>
                    <div className="flex items-center mb-4">
                      <div className="w-1.5 h-6 bg-blue-600 mr-3"></div>
                      <h2 className="text-lg font-bold text-blue-600">工作经历</h2>
                    </div>
                    <div className="space-y-6 border-l-2 border-blue-200 pl-6 ml-1 relative">
                      {experience.map((exp, index) => (
                        <div key={index} className="relative">
                          <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-7.5 top-1"></div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900">{exp.position}</h3>
                              <p className="text-blue-600 font-medium">{exp.company}</p>
                            </div>
                            <span className="text-sm font-bold text-blue-600">{exp.duration}</span>
                          </div>
                          {exp.description && <p className="text-gray-700 text-sm">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="space-y-6">
                {skillGroups.length > 0 && (
                  <section className="bg-blue-50 p-4 rounded-lg">
                    <h2 className="text-base font-bold text-blue-600 mb-3">专业技能</h2>
                    <div className="space-y-2">
                      {skillGroups.map((skill, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        );

      case 'bronzor':
        return (
          <div className="bg-white p-8 font-sans text-sm" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.name || 'John Doe'}</h1>
              <p className="text-lg text-green-600 mb-4">专业人士</p>
              <div className="flex justify-center space-x-8 text-sm text-gray-600">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
              </div>
            </div>

            <div className="space-y-6">
              <section className="grid grid-cols-5 border-t pt-4">
                <div><h4 className="text-base font-bold text-green-600">个人简介</h4></div>
                <div className="col-span-4">
                  <p className="text-gray-700">
                    {experience.length > 0 
                      ? `拥有${experience.length}年以上工作经验的专业人士，专注于${experience[0]?.position || '相关领域'}。`
                      : '积极上进的专业人士，具备扎实的专业基础和学习能力。'
                    }
                  </p>
                </div>
              </section>

              {experience.length > 0 && (
                <section className="grid grid-cols-5 border-t pt-4">
                  <div><h4 className="text-base font-bold text-green-600">工作经历</h4></div>
                  <div className="col-span-4 space-y-4">
                    {experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                            <p className="text-green-600 font-medium">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-600 bg-green-100 px-2 py-1 rounded">{exp.duration}</span>
                        </div>
                        {exp.description && <p className="text-gray-700 text-sm">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {skillGroups.length > 0 && (
                <section className="grid grid-cols-5 border-t pt-4">
                  <div><h4 className="text-base font-bold text-green-600">专业技能</h4></div>
                  <div className="col-span-4 grid grid-cols-2 gap-2">
                    {skillGroups.map((skill, index) => (
                      <div key={index} className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                        {skill}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        );

      case 'pikachu':
        return (
          <div className="bg-white font-sans text-sm" style={{ fontFamily: 'Titillium Web, sans-serif' }}>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-8 mb-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">{personalInfo.name || 'John Doe'}</h1>
                <p className="text-lg opacity-90 mb-4">专业人士</p>
                <div className="flex justify-center space-x-8 text-sm">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
              </div>
            </div>

            <div className="px-8 pb-8">
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-6">
                  {experience.length > 0 && (
                    <section>
                      <h2 className="text-xl font-bold text-yellow-600 mb-4 flex items-center">
                        <span className="w-2 h-8 bg-yellow-600 mr-3"></span>
                        工作经历
                      </h2>
                      <div className="space-y-6">
                        {experience.map((exp, index) => (
                          <div key={index} className="relative pl-6">
                            <div className="absolute left-0 top-2 w-3 h-3 bg-yellow-600 rounded-full"></div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                <p className="text-yellow-600 font-semibold">{exp.company}</p>
                              </div>
                              <span className="text-sm text-gray-600 bg-yellow-100 px-3 py-1 rounded-full">{exp.duration}</span>
                            </div>
                            {exp.description && <p className="text-gray-700">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <div className="space-y-6">
                  {skillGroups.length > 0 && (
                    <section>
                      <h2 className="text-lg font-bold text-yellow-600 mb-4">技能专长</h2>
                      <div className="space-y-2">
                        {skillGroups.map((skill, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                            <span className="text-gray-700 text-sm">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'onyx':
        return (
          <div className="bg-white p-8 font-serif text-sm" style={{ fontFamily: 'PT Serif, serif' }}>
            <div className="mb-8 pb-6 border-b-2 border-red-600">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.name || 'John Doe'}</h1>
              <p className="text-xl text-red-600 mb-4">专业人士</p>
              <div className="space-y-1 text-sm text-gray-600">
                {personalInfo.email && (
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-red-600 rounded-full mr-3 flex items-center justify-center text-white text-xs">@</span>
                    {personalInfo.email}
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-red-600 rounded-full mr-3 flex items-center justify-center text-white text-xs">☎</span>
                    {personalInfo.phone}
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-red-600 rounded-full mr-3 flex items-center justify-center text-white text-xs">📍</span>
                    {personalInfo.location}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-8">
              <div className="col-span-3 space-y-8">
                {experience.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-red-600 mb-4 uppercase">工作经历</h2>
                    <div className="space-y-6">
                      {experience.map((exp, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                              <p className="text-red-600 font-semibold">{exp.company}</p>
                            </div>
                            <span className="text-sm text-gray-600 font-medium">{exp.duration}</span>
                          </div>
                          {exp.description && (
                            <div className="text-gray-700 pl-4 border-l-2 border-red-200">
                              <p>{exp.description}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="space-y-6">
                {skillGroups.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-red-600 mb-4 uppercase">技能</h2>
                    <div className="space-y-2">
                      {skillGroups.map((skill, index) => (
                        <div key={index} className="text-sm text-gray-700 py-1 border-b border-gray-200">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        );

      case 'ditto':
        return (
          <div className="bg-white font-serif text-sm" style={{ fontFamily: 'Merriweather, serif' }}>
            <div className="relative mb-8">
              <div className="absolute inset-x-0 top-0 h-20 bg-blue-600"></div>
              <div className="relative z-10 text-center pt-8 pb-4">
                <h1 className="text-4xl font-bold text-white mb-3">{personalInfo.name || 'John Doe'}</h1>
                <p className="text-lg text-blue-100 mb-6">专业人士</p>
                <div className="text-white text-sm space-y-1">
                  {personalInfo.email && <div>{personalInfo.email}</div>}
                  {personalInfo.phone && <div>{personalInfo.phone}</div>}
                  {personalInfo.location && <div>{personalInfo.location}</div>}
                </div>
              </div>
            </div>

            <div className="px-8 pb-8">
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                  {experience.length > 0 && (
                    <section>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-1 bg-blue-600 mr-3"></div>
                        <h2 className="text-lg font-bold text-blue-600 uppercase">工作经历</h2>
                      </div>
                      <div className="space-y-6">
                        {experience.map((exp, index) => (
                          <div key={index} className="relative pl-4">
                            <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full -ml-1"></div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                                <p className="text-blue-600 font-semibold">{exp.company}</p>
                              </div>
                              <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded">{exp.duration}</span>
                            </div>
                            {exp.description && (
                              <div className="mt-3 pl-4 border-l-4 border-blue-200">
                                <p className="text-gray-700">{exp.description}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <div className="space-y-6">
                  {skillGroups.length > 0 && (
                    <section>
                      <div className="flex items-center mb-4">
                        <div className="w-4 h-1 bg-blue-600 mr-2"></div>
                        <h2 className="text-base font-bold text-blue-600 uppercase">技能</h2>
                      </div>
                      <div className="space-y-2">
                        {skillGroups.map((skill, index) => (
                          <div key={index} className="bg-blue-50 px-3 py-2 rounded text-sm text-blue-800 font-medium">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        // 默认使用标准模板
        return renderNewTemplate(StandardTemplate);
    }
  };

  // 根据模板名称渲染对应模板
  const renderTemplate = () => {
    switch (templateName) {
      // 新模板
      case 'standard':
        return renderNewTemplate(StandardTemplate);
      case 'elite':
        return renderNewTemplate(EliteTemplate);
      case 'modern-timeline':
        return renderNewTemplate(ModernTimelineTemplate);
      case 'minimal-business':
        return renderNewTemplate(MinimalBusinessTemplate);
      case 'creative-duotone':
        return renderNewTemplate(CreativeDuoToneTemplate);
      
      // 保留的旧模板（向后兼容）
      case 'azurill':
      case 'bronzor':
      case 'pikachu':
      case 'onyx':
      case 'ditto':
        return renderLegacyTemplates();
      
      default:
        // 默认使用标准模板
        return renderNewTemplate(StandardTemplate);
    }
  };

  return (
    <div className="w-full">
      {renderTemplate()}
    </div>
  );
};

export default TemplateRenderer;
