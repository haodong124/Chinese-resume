import React, { useState, useEffect } from 'react'
import { Share2, Copy, CheckCircle, X } from 'lucide-react'
import { generateShareLink, checkExportPermission } from '../lib/supabase'

const ShareUnlockModal = ({ isOpen, onClose, resumeId, onUnlocked }) => {
  const [shareUrl, setShareUrl] = useState('')
  const [currentClicks, setCurrentClicks] = useState(0)
  const [requiredClicks, setRequiredClicks] = useState(3)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && resumeId) {
      checkPermissionAndGenerateLink()
    }
  }, [isOpen, resumeId])

  const checkPermissionAndGenerateLink = async () => {
    setLoading(true)
    try {
      // 检查当前权限状态
      const permission = await checkExportPermission(resumeId)
      
      if (permission) {
        setCurrentClicks(permission.currentClicks)
        setRequiredClicks(permission.requiredClicks)
        setIsUnlocked(permission.canExport)
        
        if (permission.canExport) {
          onUnlocked()
          return
        }
      }

      // 生成分享链接
      const shareData = await generateShareLink(resumeId)
      if (shareData) {
        setShareUrl(shareData.shareUrl)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  const progress = (currentClicks / requiredClicks) * 100

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {isUnlocked ? '🎉 导出已解锁！' : '🔐 分享解锁PDF导出'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : isUnlocked ? (
          <div className="text-center py-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-gray-600 mb-6">恭喜！您已成功解锁PDF导出功能</p>
            <button
              onClick={() => {
                onClose()
                onUnlocked()
              }}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              立即导出PDF
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              分享您的简历链接，获得 <span className="font-bold text-blue-600">{requiredClicks}</span> 次有效点击即可解锁高清PDF导出功能
            </p>

            {/* 进度条 */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>解锁进度</span>
                <span className="font-medium">{currentClicks}/{requiredClicks} 次点击</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 分享链接 */}
            {shareUrl && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  您的专属分享链接
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 mt-1">链接已复制到剪贴板！</p>
                )}
              </div>
            )}

            {/* 分享提示 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Share2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">分享提示</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• 分享到微信群、朋友圈获得更多曝光</li>
                    <li>• 每个独立访客点击算一次有效点击</li>
                    <li>• 达到要求后自动解锁，永久有效</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ShareUnlockModal
