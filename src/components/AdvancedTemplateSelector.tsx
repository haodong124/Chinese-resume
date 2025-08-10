import React from 'react';
import { ArrowLeft } from 'lucide-react';

// 从 App.tsx 导入的类型定义
export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  title?: string
  summary?: string
  website?: string
}

export interface Education {
  id: string
  school: string
  degree: string
  major: string
  duration: string
  description: string
  gpa?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description: string
  isInternship?: boolean
  achievements?: string[]
}

export interface Project {
  id: string
  name: string
  role: string
  duration: string
  description: string
  technologies: string
  link?: string
}

export interface Skill {
  id: string
  name: string
  level: 'understand' | 'proficient' | 'expert'
  category: string
  description?: string
  capabilities?: string[]
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  date: string
  link?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  type: 'education' | 'work' | 'project' | 'other'
  date?: string
}

export interface IndustryAnalysis {
  trends: string[]
  emergingSkills: string[]
  decliningSkills: string[]
  aiImpact: string
  remoteWorkImpact: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  certificates: Certificate[]
  achievements: Achievement[]
  skillsSummary?: string
  industryAnalysis?: IndustryAnalysis
}

export type TemplateType = 
  | 'modern' 
  | 'classic' 
  | 'azurill' 
  | 'bronzor' 
  | 'europass'

// 修正后的Props接口，与App.tsx中的调用匹配
interface AdvancedTemplateSelectorProps {
  resumeData: ResumeData
  onSelectTemplate: (template: TemplateType) => void
  onBack: () => void
}

const AdvancedTemplateSelector: React.FC<AdvancedTemplateSelectorProps> = ({
  resumeData,
  onSelectTemplate,
  onBack
}) => {
  const templates = [
    {
      id: 'europass' as TemplateType,
      name: 'Europass',
      description: '欧洲标准简历格式',
      color: 'blue',
      icon: '🇪🇺',
      features: ['标准格式', '专业认证', '国际通用']
    },
    {
      id: 'azurill' as TemplateType,
      name: 'Azurill',
      description: '蓝色时间线设计',
      color: 'blue',
      icon: '🔵',
      features: ['时间线布局', '双栏设计', '专业配色']
    },
    {
      id: 'bronzor' as TemplateType,
      name: 'Bronzor',
      description: '绿色网格布局',
      color: 'green',
      icon: '🟢',
      features: ['网格系统', '简洁现代', '信息密集']
    },
    {
      id: 'modern' as TemplateType,
      name: 'Modern',
      description: '现代简约设计',
      color: 'blue',
      icon: '🎨',
      features: ['现代设计', '简约风格', '可读性强']
    },
    {
      id: 'classic' as TemplateType,
      name: 'Classic',
      description: '经典传统风格',
      color: 'gray',
      icon: '📋',
      features: ['传统布局', '正式风格', '稳重大方']
    }
  ];

  const getColorClasses = (color: string) => {
    const baseClasses = 'border-2 rounded-lg transition-all duration-200 hover:shadow-md hover:border-gray-400';
    
    switch (color) {
      case 'blue':
        return `${baseClasses} border-blue-200 hover:border-blue-400`;
      case 'green':
        return `${baseClasses} border-green-200 hover:border-green-400`;
      case 'gray':
        return `${baseClasses} border-gray-200 hover:border-gray-400`;
      default:
        return `${baseClasses} border-gray-200 hover:border-gray-400`;
    }
  };

  const getHeaderColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'green':
        return 'text-green-600';
      case 'gray':
        return 'text-gray-600';
      default:
        return 'text-blue-600';
    }
  };

  // 修正后的事件处理函数
  const handleTemplateClick = (templateId: TemplateType) => {
    onSelectTemplate(templateId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                选择简历模板
              </h1>
              <p className="text-gray-600">
                为您的专业简历选择最合适的设计风格
              </p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回上一步</span>
            </button>
          </div>

          {/* 用户信息预览 */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">预览信息</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">姓名：</span>
                <span className="text-blue-800">{resumeData.personalInfo.name || '未填写'}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">职位：</span>
                <span className="text-blue-800">{resumeData.personalInfo.title || '未填写'}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">技能数量：</span>
                <span className="text-blue-800">{resumeData.skills.length} 项</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">工作经历：</span>
                <span className="text-blue-800">{resumeData.experience.length} 项</span>
              </div>
            </div>
          </div>

          {/* 模板提示 */}
          <div className="text-sm text-gray-600 mb-6">
            选择专业简历模板，每个模板都经过精心设计，适配不同的职业需求。
          </div>
          
          {/* 模板网格 */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template.id)}
                className={`p-6 text-left transition-all duration-200 hover:shadow-lg ${getColorClasses(template.color)} bg-white`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{template.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`text-xl font-semibold ${getHeaderColorClasses(template.color)}`}>
                        {template.name}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        推荐
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      template.color === 'blue' ? 'border-blue-500' : 
                      template.color === 'green' ? 'border-green-500' : 'border-gray-500'
                    }`}></div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 模板预览提示 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 mt-0.5">💡</div>
              <div className="text-sm text-blue-700">
                <strong>提示：</strong> 选择模板后将立即进入简历编辑器，您可以在那里预览效果并进行最终调整。每个模板都针对不同行业和职位进行了优化设计。
              </div>
            </div>
          </div>

          {/* 底部导航 */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回技能推荐</span>
            </button>

            <div className="text-sm text-gray-500">
              点击任一模板即可开始生成简历
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTemplateSelector;
