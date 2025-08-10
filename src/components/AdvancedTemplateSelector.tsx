import React from 'react';
import { ArrowLeft } from 'lucide-react';

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

export type TemplateType = 'standard'

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
  // 直接选择标准模板
  const handleTemplateClick = () => {
    onSelectTemplate('standard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                专业简历模板
              </h1>
              <p className="text-gray-600">
                采用国际标准格式，专为现代职场设计
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

          {/* 标准模板展示 */}
          <div className="mb-8">
            <button
              onClick={handleTemplateClick}
              className="w-full p-8 text-left transition-all duration-200 hover:shadow-lg border-2 border-blue-200 hover:border-blue-400 bg-white rounded-lg"
            >
              <div className="flex items-start space-x-6">
                <div className="text-4xl">📋</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-2xl font-semibold text-blue-600">
                      标准简历模板
                    </h3>
                    <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                      统一使用
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 text-lg">
                    中文标准简历格式，采用单栏双栏结合布局，最大化利用A4纸张空间，专业美观
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                      A4标准尺寸
                    </span>
                    <span className="text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                      中文专业格式
                    </span>
                    <span className="text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                      量化成果展示
                    </span>
                    <span className="text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                      技能详细描述
                    </span>
                    <span className="text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                      混合栏布局
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* 模板特色说明 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">🎯 设计特色</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• 单栏双栏结合，信息层次清晰</li>
                <li>• 技能部分支持详细能力描述</li>
                <li>• 成就亮点前置，突出个人价值</li>
                <li>• 中文排版优化，阅读体验佳</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-green-900 mb-3">✨ 适用场景</h4>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• 适合所有行业和职位级别</li>
                <li>• 技术岗位技能展示优化</li>
                <li>• 支持量化成果和具体成就</li>
                <li>• 完美A4打印和PDF导出</li>
              </ul>
            </div>
          </div>

          {/* 底部导航 */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回技能推荐</span>
            </button>

            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-1">点击上方模板开始生成</div>
              <div className="text-sm text-gray-500">所有用户统一使用此专业格式</div>
            </div>

            <button
              onClick={handleTemplateClick}
              className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span>使用此模板</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTemplateSelector;
