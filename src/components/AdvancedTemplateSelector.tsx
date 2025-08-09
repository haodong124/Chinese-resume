import React from 'react';

interface AdvancedTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const AdvancedTemplateSelector: React.FC<AdvancedTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  const templates = [
    {
      id: 'europass',
      name: 'Europass',
      description: '欧洲标准简历格式',
      color: 'blue',
      icon: '🇪🇺',
      features: ['标准格式', '专业认证', '国际通用']
    },
    {
      id: 'azurill',
      name: 'Azurill',
      description: '蓝色时间线设计',
      color: 'blue',
      icon: '🔵',
      features: ['时间线布局', '双栏设计', '专业配色']
    },
    {
      id: 'bronzor',
      name: 'Bronzor',
      description: '绿色网格布局',
      color: 'green',
      icon: '🟢',
      features: ['网格系统', '简洁现代', '信息密集']
    },
    {
      id: 'pikachu',
      name: 'Pikachu',
      description: '黄色活力设计',
      color: 'yellow',
      icon: '🟡',
      features: ['渐变头部', '活力配色', '视觉层次']
    },
    {
      id: 'onyx',
      name: 'Onyx',
      description: '红色商务风格',
      color: 'red',
      icon: '🔴',
      features: ['商务正式', '四栏布局', '专业精致']
    },
    {
      id: 'ditto',
      name: 'Ditto',
      description: '蓝色优雅设计',
      color: 'blue',
      icon: '🔷',
      features: ['优雅简约', '装饰线条', '现代风格']
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = 'border-2 rounded-lg transition-all duration-200 hover:shadow-md';
    
    if (isSelected) {
      switch (color) {
        case 'blue':
          return `${baseClasses} border-blue-500 bg-blue-50 shadow-lg`;
        case 'green':
          return `${baseClasses} border-green-500 bg-green-50 shadow-lg`;
        case 'yellow':
          return `${baseClasses} border-yellow-500 bg-yellow-50 shadow-lg`;
        case 'red':
          return `${baseClasses} border-red-500 bg-red-50 shadow-lg`;
        default:
          return `${baseClasses} border-blue-500 bg-blue-50 shadow-lg`;
      }
    } else {
      return `${baseClasses} border-gray-200 hover:border-gray-300 bg-white`;
    }
  };

  const getHeaderColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'green':
        return 'text-green-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'red':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        选择专业简历模板，每个模板都经过精心设计，适合不同的职业需求。
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`p-4 text-left ${getColorClasses(template.color, selectedTemplate === template.id)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{template.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className={`font-semibold ${getHeaderColorClasses(template.color)}`}>
                    {template.name}
                  </h3>
                  {selectedTemplate === template.id && (
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      已选择
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 模板预览提示 */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="text-blue-500 mt-0.5">💡</div>
          <div className="text-sm text-blue-700">
            <strong>提示：</strong> 选择模板后，在右侧预览区域切换到"专业"模式即可查看效果。每个模板都针对不同行业和职位进行了优化设计。
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTemplateSelector;
