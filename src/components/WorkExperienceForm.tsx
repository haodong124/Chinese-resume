import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Plus, Trash2, Edit3, Briefcase, Star, Calendar, Building } from 'lucide-react'

export interface WorkExperience {
  id: string
  company: string
  position: string
  duration: string
  description: string
  isInternship?: boolean
  achievements?: string[]
}

interface WorkExperienceFormProps {
  initialData?: WorkExperience[]
  onComplete: (data: WorkExperience[]) => void
  onBack: () => void
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  initialData = [],
  onComplete,
  onBack
}) => {
  const [experiences, setExperiences] = useState<WorkExperience[]>(initialData)
  const [currentExperience, setCurrentExperience] = useState<WorkExperience>({
    id: '',
    company: '',
    position: '',
    duration: '',
    description: '',
    isInternship: false,
    achievements: []
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentAchievement, setCurrentAchievement] = useState('')

  // 日期选择器辅助函数
  const generateDateOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= currentYear - 20; year--) {
      years.push(year)
    }
    return years
  }

  const months = [
    '01月', '02月', '03月', '04月', '05月', '06月',
    '07月', '08月', '09月', '10月', '11月', '12月'
  ]

  const [startYear, setStartYear] = useState('')
  const [startMonth, setStartMonth] = useState('')
  const [endYear, setEndYear] = useState('')
  const [endMonth, setEndMonth] = useState('')
  const [isPresent, setIsPresent] = useState(false)

  // 处理日期变化
  const handleDateChange = () => {
    if (startYear && startMonth) {
      const endDate = isPresent ? '至今' : (endYear && endMonth ? `${endYear}年${endMonth}` : '')
      const duration = endDate ? `${startYear}年${startMonth} - ${endDate}` : ''
      setCurrentExperience(prev => ({ ...prev, duration }))
    }
  }

  React.useEffect(() => {
    handleDateChange()
  }, [startYear, startMonth, endYear, endMonth, isPresent])

  // 添加工作成就
  const handleAddAchievement = () => {
    if (currentAchievement.trim()) {
      setCurrentExperience(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), currentAchievement.trim()]
      }))
      setCurrentAchievement('')
    }
  }

  // 删除工作成就
  const handleRemoveAchievement = (index: number) => {
    setCurrentExperience(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || []
    }))
  }

  // 保存或更新经验
  const handleSaveExperience = () => {
    if (currentExperience.company && currentExperience.position && currentExperience.duration) {
      if (isEditing && editingId) {
        setExperiences(prev => prev.map(exp => 
          exp.id === editingId ? { ...currentExperience, id: editingId } : exp
        ))
      } else {
        setExperiences(prev => [...prev, { ...currentExperience, id: Date.now().toString() }])
      }
      resetForm()
    }
  }

  // 重置表单
  const resetForm = () => {
    setCurrentExperience({
      id: '',
      company: '',
      position: '',
      duration: '',
      description: '',
      isInternship: false,
      achievements: []
    })
    setStartYear('')
    setStartMonth('')
    setEndYear('')
    setEndMonth('')
    setIsPresent(false)
    setIsEditing(false)
    setEditingId(null)
    setCurrentAchievement('')
  }

  // 编辑经验
  const handleEditExperience = (exp: WorkExperience) => {
    setCurrentExperience(exp)
    setIsEditing(true)
    setEditingId(exp.id)
    
    // 解析日期
    const durationMatch = exp.duration.match(/(\d{4})年(\d{2})月 - (.+)/)
    if (durationMatch) {
      setStartYear(durationMatch[1])
      setStartMonth(durationMatch[2])
      if (durationMatch[3] === '至今') {
        setIsPresent(true)
      } else {
        const endMatch = durationMatch[3].match(/(\d{4})年(\d{2})月/)
        if (endMatch) {
          setEndYear(endMatch[1])
          setEndMonth(endMatch[2])
        }
      }
    }
  }

  // 删除经验
  const handleDeleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id))
  }

  // 提交
  const handleSubmit = () => {
    if (experiences.length > 0 || window.confirm('您还没有添加任何工作经验，确定要跳过吗？')) {
      onComplete(experiences)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Briefcase className="mr-3 h-8 w-8 text-blue-600" />
              工作经历 / 实习经验
            </h1>
            <p className="text-gray-600">
              请填写您的工作或实习经历，包括公司名称、职位、时间段等信息
            </p>
          </div>

          {/* 表单 */}
          <div className="space-y-6">
            {/* 公司名称和职位 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司名称 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={currentExperience.company}
                    onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="如：腾讯科技有限公司"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  职位名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentExperience.position}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="如：前端开发实习生"
                />
              </div>
            </div>

            {/* 时间段 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工作时间 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">开始年份</option>
                  {generateDateOptions().map(year => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </select>
                
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">开始月份</option>
                  {months.map((month, index) => (
                    <option key={month} value={String(index + 1).padStart(2, '0')}>{month}</option>
                  ))}
                </select>
                
                <div className="flex items-center justify-center text-gray-500">—</div>
                
                {!isPresent && (
                  <>
                    <select
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">结束年份</option>
                      {generateDateOptions().map(year => (
                        <option key={year} value={year}>{year}年</option>
                      ))}
                    </select>
                    
                    <select
                      value={endMonth}
                      onChange={(e) => setEndMonth(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">结束月份</option>
                      {months.map((month, index) => (
                        <option key={month} value={String(index + 1).padStart(2, '0')}>{month}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>
              
              <div className="mt-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isPresent}
                    onChange={(e) => setIsPresent(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">至今在职</span>
                </label>
              </div>
            </div>

            {/* 是否为实习 */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentExperience.isInternship}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, isInternship: e.target.checked }))}
                  className="mr-2 h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">这是一份实习经历</span>
              </label>
            </div>

            {/* 工作内容描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工作内容与成果 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={currentExperience.description}
                onChange={(e) => setCurrentExperience(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="例如：参与公司官网改版，优化页面加载速度30%..."
              />
            </div>

            {/* 工作成就（可选） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="inline h-4 w-4 text-yellow-500 mr-1" />
                工作成就（可选）
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentAchievement}
                    onChange={(e) => setCurrentAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="如：获得优秀实习生称号"
                  />
                  <button
                    onClick={handleAddAchievement}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    添加
                  </button>
                </div>
                
                {currentExperience.achievements && currentExperience.achievements.length > 0 && (
                  <div className="space-y-1">
                    {currentExperience.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">• {achievement}</span>
                        <button
                          onClick={() => handleRemoveAchievement(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 保存按钮 */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveExperience}
                disabled={!currentExperience.company || !currentExperience.position || !currentExperience.duration}
                className={`px-6 py-2 rounded-lg font-medium ${
                  currentExperience.company && currentExperience.position && currentExperience.duration
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isEditing ? '更新经历' : '添加经历'}
              </button>
            </div>
          </div>

          {/* 已添加的经历列表 */}
          {experiences.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">已添加的经历</h3>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                          {exp.isInternship && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">实习</span>
                          )}
                        </div>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
                        <p className="text-gray-700">{exp.description}</p>
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">主要成就：</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {exp.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditExperience(exp)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 导航按钮 */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回上一步</span>
            </button>
            
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span>下一步</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkExperienceForm
