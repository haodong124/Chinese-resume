import React from 'react'
import { ArrowLeft, FileText, Palette, Download, Upload } from 'lucide-react'

interface HeaderProps {
  onBackToHome: () => void
  showBackButton: boolean
  onShowTemplates?: () => void
  onExportData?: () => void
  onImportData?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Header: React.FC<HeaderProps> = ({ 
  onBackToHome, 
  showBackButton, 
  onShowTemplates,
  onExportData,
  onImportData
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>返回首页</span>
              </button>
            )}
            {!showBackButton && (
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">简历制作工具</h1>
              </div>
            )}
          </div>
          
          <nav className="flex items-center space-x-4">
            {onShowTemplates && (
              <button
                onClick={onShowTemplates}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Palette className="h-4 w-4" />
                <span>模板库</span>
              </button>
            )}
            
            {onExportData && (
              <button
                onClick={onExportData}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>导出</span>
              </button>
            )}
            
            {onImportData && (
              <label className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>导入</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                />
              </label>
            )}
            
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              帮助
            </a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              登录
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header