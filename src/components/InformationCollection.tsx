import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Plus, Trash2, User, GraduationCap, FileText } from 'lucide-react'

interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  title?: string
  summary?: string
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

interface InformationCollectionProps {
  initialData: PersonalInfo
  initialEducation: Education[]
  onComplete: (info: PersonalInfo, education: Education[]) => void
  onBack: () => void
}

const InformationCollection: React.FC<InformationCollectionProps> = ({
  initialData,
  initialEducation,
  onComplete,
  onBack
}) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialData || {
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: ''
  })
  const [education, setEducation] = useState<Education[]>(
    (initialEducation && initialEducation.length > 0) ? initialEducation : [{
      id: '1',
      school: '',
      degree: '',
      major: '',
      duration: '',
      description: '',
      gpa: ''
    }]
  )
  const [currentStep, setCurrentStep] = useState(1)

  const degreeOptions = [
    '高中',
    '大专',
    '本科',
    '硕士',
    '博士',
    '其他'
  ]

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setEducation(prev => prev.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    ))
  }

  const addEducation = () => {
    const newId = ((education?.length || 0) + 1).toString()
    setEducation(prev => [...(prev || []), {
      id: newId,
      school: '',
      degree: '',
      major: '',
      duration: '',
      description: '',
      gpa: ''
    }])
  }

  const removeEducation = (index: number) => {
    if (education && education.length > 1) {
      setEducation(prev => prev.filter((_, i) => i !== index))
    }
  }

  const isPersonalInfoValid = () => {
    return personalInfo && personalInfo.name && personalInfo.email && personalInfo.phone && personalInfo.location
  }

  const isEducationValid = () => {
    return education && education.length > 0 && education.every(edu => edu.school && edu.degree && edu.major)
  }

  const handleNext = () => {
    if (currentStep === 1 && isPersonalInfoValid()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && isEducationValid()) {
      onComplete(personalInfo, education)
    }
  }

  const canProceed = currentStep === 1 ? isPersonalInfoValid() : isEducationValid()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回首页</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">简历制作工具</span>
            </div>
            
            <div className="text-sm text-gray-500">
              步骤 {currentStep} / 2
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-200 rounded">
                <div className={`h-full bg-blue-600 rounded transition-all duration-300 ${
                  currentStep >= 2 ? 'w-full' : 'w-0'
                }`} />
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <GraduationCap className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">个人基本信息</h1>
              <p className="text-gray-600">请填写您的基本信息，这些信息将出现在简历的头部区域</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo?.name || ''}
                  onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请输入您的姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  职位目标
                </label>
                <input
                  type="text"
                  value={personalInfo?.title || ''}
                  onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="如：高级产品经理"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={personalInfo?.email || ''}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  电话 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={personalInfo?.phone || ''}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="138-0000-0000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所在地区 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo?.location || ''}
                  onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="如：北京市朝阳区"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  个人简介
                </label>
                <textarea
                  value={personalInfo?.summary || ''}
                  onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="简要介绍您的专业背景、技能特长和职业目标..."
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">教育背景</h1>
              <p className="text-gray-600">请填写您的教育经历，从最高学历开始</p>
            </div>

            <div className="space-y-6">
              {(education || []).map((edu, index) => (
                <div key={edu.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      教育经历 {index + 1}
                    </h3>
                    {(education?.length || 0) > 1 && (
                      <button
                        onClick={() => removeEducation(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        学校名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="如：清华大学"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        学历 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">请选择学历</option>
                        {degreeOptions.map(degree => (
                          <option key={degree} value={degree}>{degree}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        专业 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.major}
                        onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="如：计算机科学与技术"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        就读时间
                      </label>
                      <input
                        type="text"
                        value={edu.duration}
                        onChange={(e) => handleEducationChange(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="如：2018-2022"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GPA/成绩
                      </label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="如：3.8/4.0"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        相关描述
                      </label>
                      <textarea
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="主要课程、获得奖项、社团活动等..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addEducation}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>添加教育经历</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => currentStep === 1 ? onBack() : setCurrentStep(1)}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{currentStep === 1 ? '返回首页' : '上一步'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              canProceed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === 1 ? '下一步' : '开始AI推荐'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  )
}

export default InformationCollection