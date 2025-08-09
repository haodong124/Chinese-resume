import React, { useState } from 'react'
import { FileText, Zap, Download, Palette, Users, Star, ArrowRight, Play, CheckCircle, Globe, Smartphone, Lock } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [activeTemplate, setActiveTemplate] = useState(0)

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "智能简历制作",
      description: "AI驱动的智能建议，帮您打造完美简历"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "多种专业模板",
      description: "精选设计模板，适配不同行业需求"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "一键导出",
      description: "支持PDF、Word等多种格式导出"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "完全免费",
      description: "无需注册，完全免费使用所有功能"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "响应式设计",
      description: "支持手机、平板、电脑等多端使用"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "隐私保护",
      description: "本地存储，您的数据完全由您掌控"
    }
  ]

  const templates = [
    {
      name: "现代风格",
      description: "简洁现代，适合互联网行业",
      image: "🎨"
    },
    {
      name: "经典风格", 
      description: "传统正式，适合传统行业",
      image: "📋"
    },
    {
      name: "创意风格",
      description: "独特创意，适合设计师",
      image: "✨"
    },
    {
      name: "极简风格",
      description: "极简设计，突出内容",
      image: "🎯"
    }
  ]

  const testimonials = [
    {
      name: "张三",
      role: "产品经理",
      content: "用这个工具制作的简历帮我成功找到了心仪的工作，界面简洁，功能强大！",
      avatar: "👨‍💼"
    },
    {
      name: "李小雨",
      role: "UI设计师", 
      content: "模板设计很专业，AI建议功能特别实用，大大提高了简历制作效率。",
      avatar: "👩‍🎨"
    },
    {
      name: "王工程师",
      role: "前端开发",
      content: "完全免费还这么好用，强烈推荐给所有求职的朋友们！",
      avatar: "👨‍💻"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">简历制作工具</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">功能特色</a>
              <a href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors">模板库</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">用户评价</a>
              <button 
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                开始制作
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Zap className="h-4 w-4 mr-1" />
                AI 智能简历助手
              </div>
              
              <div className="space-y-4">
 <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
    您的最终选择，
    <br />
    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
      一站式专业级别的
    </span>
    <br />
    简历制作工具
  </h1>
  
  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
    总结您的核心竞争力，打造专业简历，助力职业发展。
  </p>
</div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105 font-medium"
                >
                  开始制作
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors font-medium">
                  <Play className="mr-2 h-5 w-5" />
                  查看演示
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  完全免费
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  无需注册
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  隐私安全
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-4">
                  <h2 className="text-2xl font-bold mb-2">张明</h2>
                  <p className="text-blue-100">高级产品经理</p>
                  <div className="mt-4 text-sm opacity-90">
                    <p>📧 zhangming@example.com</p>
                    <p>📱 138-0000-0000</p>
                    <p>📍 北京市朝阳区</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">工作经历</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">高级产品经理 · 腾讯</p>
                        <p className="text-xs">2021-至今</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">产品经理 · 阿里巴巴</p>
                        <p className="text-xs">2019-2021</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">技能专长</h3>
                    <div className="flex flex-wrap gap-2">
                      {['产品设计', '用户研究', '数据分析', 'Axure'].map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              为什么选择我们的简历工具？
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              我们提供最专业、最便捷的简历制作体验，帮助您在竞争中脱颖而出
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              精选专业模板
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              多种设计风格，适配不同行业和职位需求
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <div 
                key={index}
                className={`group cursor-pointer p-6 bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  activeTemplate === index ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setActiveTemplate(index)}
              >
                <div className="text-4xl mb-4">{template.image}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm">{template.description}</p>
                <button className="mt-4 w-full py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                  预览模板
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              用户真实评价
            </h2>
            <p className="text-xl text-gray-600">
              看看其他用户如何评价我们的简历工具
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            准备好制作您的专业简历了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            现在就开始，几分钟内创建一份让HR眼前一亮的简历
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg transform hover:scale-105"
          >
            立即开始制作
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">简历制作工具</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                免费、开源的中文简历制作工具，帮助每个人都能制作出专业的简历。
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  微博
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  微信
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">产品</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">功能特色</a></li>
                <li><a href="#" className="hover:text-white transition-colors">模板库</a></li>
                <li><a href="#" className="hover:text-white transition-colors">使用指南</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">支持</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">反馈建议</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 简历制作工具. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
