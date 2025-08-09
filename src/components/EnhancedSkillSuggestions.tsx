import React, { useState } from 'react'
import { Lightbulb, Loader2, Plus, Sparkles } from 'lucide-react'
import { ResumeData } from '../App'

interface SkillSuggestion {
  skill: string
  reason: string
  category: string
}

interface EnhancedSkillSuggestionsProps {
  resumeData: ResumeData
  onAddSkill: (skill: string) => void
}

const EnhancedSkillSuggestions: React.FC<EnhancedSkillSuggestionsProps> = ({ 
  resumeData, 
  onAddSkill 
}) => {
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 你的API Key
  const API_KEY = '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'

  const generateSkillSuggestions = async () => {
    setLoading(true)
    setError(null)

    try {
      // 构建用户简历信息
      const resumeSummary = {
        experience: resumeData.experience.map(exp => `${exp.position}在${exp.company}: ${exp.description}`).join('\n'),
        projects: resumeData.projects.map(proj => `${proj.name}: ${proj.description} 技术栈: ${proj.technologies}`).join('\n'),
        currentSkills: resumeData.skills || ''
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的职业规划师。基于用户的工作经历和项目经验，推荐5-6个最有价值的技能。请以JSON数组格式返回，每个技能包含skill(技能名称)、reason(推荐理由)、category(技能分类)三个字段。'
            },
            {
              role: 'user',
              content: `工作经历：${resumeSummary.experience}\n\n项目经验：${resumeSummary.projects}\n\n现有技能：${resumeSummary.currentSkills}\n\n请推荐相关技能。`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('API返回内容为空')
      }

      // 解析JSON响应
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        const jsonContent = jsonMatch ? jsonMatch[0] : content
        const parsedSuggestions = JSON.parse(jsonContent)
        setSuggestions(parsedSuggestions.slice(0, 6))
      } catch (parseError) {
        // 如果JSON解析失败，提供默认建议
        const defaultSuggestions = [
          { skill: 'Docker', reason: '容器化技术，提高部署效率', category: '运维工具' },
          { skill: 'TypeScript', reason: '增强JavaScript类型安全性', category: '编程语言' },
          { skill: 'Redis', reason: '高性能缓存数据库', category: '数据库' },
          { skill: 'AWS', reason: '云计算平台，提高可扩展性', category: '云服务' },
          { skill: 'Git', reason: '版本控制系统，团队协作必备', category: '开发工具' }
        ]
        setSuggestions(defaultSuggestions)
      }
      
    } catch (error) {
      console.error('生成技能建议失败:', error)
      setError(error instanceof Error ? error.message : '生成失败')
      
      // 提供默认建议作为后备
      const fallbackSuggestions = [
        { skill: 'React', reason: '流行的前端框架，市场需求大', category: '前端框架' },
        { skill: 'Node.js', reason: '服务端JavaScript运行环境', category: '后端技术' },
        { skill: 'Python', reason: '多用途编程语言，AI/数据分析热门', category: '编程语言' },
        { skill: 'SQL', reason: '数据库查询语言，数据处理必备', category: '数据库' },
        { skill: 'Git', reason: '版本控制工具，开发必备技能', category: '开发工具' }
      ]
      setSuggestions(fallbackSuggestions)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = (skill: string) => {
    onAddSkill(skill)
    setSuggestions(prev => prev.filter(s => s.skill !== skill))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI 技能建议</h2>
        </div>
        
        {!loading && (
          <button
            onClick={generateSkillSuggestions}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            <span>获取建议</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">AI 正在分析你的简历...</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
          <p className="text-xs text-red-600 mt-1">已提供通用技能建议</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 mb-3">推荐技能：</h3>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">{suggestion.skill}</h4>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {suggestion.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{suggestion.reason}</p>
              </div>
              <button
                onClick={() => handleAddSkill(suggestion.skill)}
                className="ml-4 flex items-center space-x-1 px-3 py-1 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-md transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>添加</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {suggestions.length === 0 && !loading && (
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">让 AI 分析你的简历，推荐相关技能</p>
          <p className="text-xs text-gray-400">
            填写工作经历和项目后，点击"获取建议"
          </p>
        </div>
      )}
    </div>
  )
}

export default EnhancedSkillSuggestions