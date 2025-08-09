import React from 'react'
import { FileText, Download, Eye, Zap } from 'lucide-react'

interface HeroProps {
  onStartBuilding: () => void
}

const Hero: React.FC<HeroProps> = ({ onStartBuilding }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center lg:text-left">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-6">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">制作专业的</span>
                    <span className="block text-blue-600">中文简历</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl lg:mx-0 md:text-xl">
                    使用我们的在线简历制作工具，轻松创建专业、美观的中文简历。支持实时预览、多种模板选择和一键导出PDF。
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <button
                        onClick={onStartBuilding}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                      >
                        开始制作简历
                      </button>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-colors">
                        查看模板
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 lg:mt-0 lg:col-span-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <FileText className="h-12 w-12 text-blue-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">专业模板</h3>
                      <p className="text-gray-600">多种精美模板，适合不同行业和职位</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <Eye className="h-12 w-12 text-green-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">实时预览</h3>
                      <p className="text-gray-600">边编辑边预览，所见即所得</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <Download className="h-12 w-12 text-purple-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">一键导出</h3>
                      <p className="text-gray-600">支持PDF导出，高质量打印</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">快速便捷</h3>
                      <p className="text-gray-600">无需注册，即开即用</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Hero