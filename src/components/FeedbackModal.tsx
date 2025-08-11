import React, { useState } from 'react'
import { X, Star, Send, ChevronDown, CheckSquare, Heart } from 'lucide-react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitted: () => void
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    comment: '',
    isPublic: false,
    // 单选题
    aiSkillMatch: '',
    contentQuality: '',
    sitePerformance: '',
    recommendation: '',
    // 多选题
    aiAdvantages: [] as string[],
    aiImprovements: [] as string[],
    siteIssues: [] as string[],
    // 其他选项自定义输入
    aiAdvantagesOther: '',
    aiImprovementsOther: '',
    siteIssuesOther: ''
  })

  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  // 星星评分组件
  const StarRating = ({ rating, onRatingChange }: { 
    rating: number
    onRatingChange: (rating: number) => void
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <Star
              className={`h-8 w-8 ${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  // 处理多选框变化
  const handleMultipleChoice = (field: 'aiAdvantages' | 'aiImprovements' | 'siteIssues', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  // 提交评价
  const handleSubmit = async () => {
    if (formData.rating === 0) {
      alert('请选择评分')
      return
    }
    
    if (!formData.comment.trim()) {
      alert('请填写评价内容')
      return
    }

    setIsSubmitting(true)

    try {
      // 准备提交数据
      const feedbackData = {
        ...formData,
        timestamp: new Date().toISOString(),
        // 处理多选题的其他选项
        aiAdvantages: formData.aiAdvantages.includes('other') && formData.aiAdvantagesOther
          ? [...formData.aiAdvantages.filter(item => item !== 'other'), `其他: ${formData.aiAdvantagesOther}`]
          : formData.aiAdvantages,
        aiImprovements: formData.aiImprovements.includes('other') && formData.aiImprovementsOther
          ? [...formData.aiImprovements.filter(item => item !== 'other'), `其他: ${formData.aiImprovementsOther}`]
          : formData.aiImprovements,
        siteIssues: formData.siteIssues.includes('other') && formData.siteIssuesOther
          ? [...formData.siteIssues.filter(item => item !== 'other'), `其他: ${formData.siteIssuesOther}`]
          : formData.siteIssues
      }

      // 发送到您的收集端点
      await fetch('/.netlify/functions/collect-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      })

      console.log('收集到的评价数据:', feedbackData)
      
      // 成功提交
      alert('感谢您的宝贵意见！您的反馈对我们非常重要。')
      onSubmitted()
    } catch (error) {
      console.error('提交失败:', error)
      alert('提交失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">简历生成完成！</h2>
              <p className="text-sm text-gray-600">您的使用体验对我们很重要</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 表单内容 */}
        <div className="p-6 space-y-6">
          {/* 基本评价 */}
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">整体体验评分</h3>
              <StarRating 
                rating={formData.rating} 
                onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))} 
              />
              <p className="text-sm text-gray-600 mt-2">
                {formData.rating > 0 ? `${formData.rating} 星` : '请点击星星评分'}
              </p>
            </div>
          </div>

          {/* 快速评价 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分享您的使用感受
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="简单描述一下使用感受，或者给我们一些建议..."
            />
          </div>

          {/* 可选信息 */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="姓名（可选）"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="邮箱（可选）"
            />
          </div>

          {/* 详细调研问题 */}
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setShowDetailedQuestions(!showDetailedQuestions)}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              <span>详细体验调研（可选，帮助我们改进产品）</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showDetailedQuestions ? 'rotate-180' : ''}`} />
            </button>

            {showDetailedQuestions && (
              <div className="mt-4 space-y-4 bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                {/* 这里放详细问题，为了节省空间，我简化显示几个关键问题 */}
                
                {/* AI技能匹配程度 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    AI推荐技能与目标岗位的匹配程度：
                  </label>
                  <div className="space-y-1">
                    {[
                      { value: 'very_match', label: '非常匹配' },
                      { value: 'basically_match', label: '基本匹配' },
                      { value: 'average', label: '一般' },
                      { value: 'not_match', label: '不匹配' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="aiSkillMatch"
                          value={option.value}
                          checked={formData.aiSkillMatch === option.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, aiSkillMatch: e.target.value }))}
                          className="h-3 w-3 text-blue-600"
                        />
                        <span className="text-xs text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 推荐意愿 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    是否愿意推荐给朋友：
                  </label>
                  <div className="space-y-1">
                    {[
                      { value: 'definitely', label: '一定会推荐' },
                      { value: 'probably', label: '可能会推荐' },
                      { value: 'uncertain', label: '不确定' },
                      { value: 'no', label: '不会推荐' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="recommendation"
                          value={option.value}
                          checked={formData.recommendation === option.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, recommendation: e.target.value }))}
                          className="h-3 w-3 text-blue-600"
                        />
                        <span className="text-xs text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 公开显示选项 */}
          <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.value }))}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="isPublic" className="text-sm text-blue-800 cursor-pointer">
              同意将评价公开显示，帮助其他用户了解产品
            </label>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            跳过反馈
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || formData.rating === 0}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              isSubmitting || formData.rating === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>提交中...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>提交反馈</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
