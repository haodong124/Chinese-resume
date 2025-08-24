import React, { useEffect, useState } from 'react'
import { CheckCircle, Users, ArrowRight } from 'lucide-react'
import { recordShareClick } from '../lib/supabase'

const SharePage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [clickRecorded, setClickRecorded] = useState(false)
  const [clickResult, setClickResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    handleShareClick()
  }, [])

  const handleShareClick = async () => {
    try {
      // 从 URL 获取分享码
      const pathParts = window.location.pathname.split('/')
      const shareCode = pathParts[pathParts.length - 1]
      
      if (!shareCode || shareCode === 'share') {
        setError('无效的分享链接')
        setLoading(false)
        return
      }

      console.log('处理分享码:', shareCode)
      
      // 记录点击
      const result = await recordShareClick(shareCode)
      
      if (result) {
        setClickResult(result)
        setClickRecorded(true)
      } else {
        setError('记录失败，请稍后重试')
      }
    } catch (err) {
      console.error('处理分享失败:', err)
      setError('处理分享链接时出错')
    } finally {
      setLoading(false)
    }
  }

  const goToHomePage = () => {
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">正在处理分享链接...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">链接无效</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={goToHomePage}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              访问首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
        {clickRecorded ? (
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              感谢您的支持！
            </h1>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <p className="text-lg font-semibold text-blue-900 mb-2">
                分享进度：{clickResult?.currentClicks || 0}/{clickResult?.requiredClicks || 3}
              </p>
              
              {/* 进度条 */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((clickResult?.currentClicks || 0) / (clickResult?.requiredClicks || 3)) * 100}%` 
                  }}
                />
              </div>
              
              {clickResult?.isUnlocked ? (
                <p className="text-green-600 font-medium">
                  🎉 已成功解锁PDF导出功能！
                </p>
              ) : (
                <p className="text-gray-600">
                  还需要 {(clickResult?.requiredClicks || 3) - (clickResult?.currentClicks || 0)} 次点击即可解锁
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="font-semibold text-gray-900 mb-2">
                  🚀 创建您的专业简历
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  使用我们的智能简历生成器，快速创建专业、美观的中文简历
                </p>
                <button
                  onClick={goToHomePage}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  立即创建简历
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  您的点击已被记录，感谢支持！
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">处理中...</h1>
            <p className="text-gray-600">正在记录您的访问</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SharePage
