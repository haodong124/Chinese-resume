# 🚀 中文简历制作工具 - 快速设置指南

## 📋 环境要求

- Node.js 16+ 
- npm 或 yarn 或 pnpm
- OpenAI API Key（可选，用于AI功能）

## 🛠 安装步骤

### 1. 克隆项目（或下载文件）
```bash
# 如果是新项目
npm create vite@latest chinese-resume-builder -- --template react-ts
cd chinese-resume-builder
```

### 2. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 设置环境变量
```bash
# 复制环境配置模板
cp .env.example .env.local

# 编辑 .env.local 文件，添加您的API密钥
# VITE_OPENAI_API_KEY=您的OpenAI_API_Key
```

### 4. 文件结构设置
将以下文件放入对应目录：

```
src/
├── components/
│   ├── LandingPage.tsx              # 门户页面
│   ├── InformationCollection.tsx   # 信息收集页面  
│   ├── AISkillRecommendation.tsx   # AI技能推荐页面
│   └── ResumeEditor.tsx            # 您现有的简历编辑器
├── utils/
│   ├── aiService.ts                # AI服务集成
│   └── config.ts                   # 配置管理器
├── styles/
│   └── index.css                   # 样式文件
├── App.tsx                         # 更新后的主应用
└── main.tsx                        # 入口文件

根目录/
├── .env.example                    # 环境配置模板
├── .env.local                      # 本地环境配置（不提交）
├── .gitignore                      # Git忽略文件
└── setup.md                        # 此设置指南
```

### 5. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

## 🔧 配置说明

### OpenAI API 配置
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 创建新的API密钥
3. 将密钥添加到 `.env.local` 文件中

### 功能开关
可以通过环境变量控制功能启用/禁用：

```bash
# AI功能（需要API Key）
VITE_ENABLE_AI_FEATURES=true

# 用户反馈
VITE_ENABLE_USER_FEEDBACK=true

# 模板预览
VITE_ENABLE_TEMPLATE_PREVIEW=true

# 导出功能
VITE_ENABLE_EXPORT_FORMATS=true
```

### 限制配置
```bash
# 最大技能数量
VITE_MAX_SKILLS_COUNT=15

# 最大教育经历数量
VITE_MAX_EDUCATION_COUNT=5

# 最大工作经历数量
VITE_MAX_EXPERIENCE_COUNT=10
```

## 🎯 使用流程

1. **门户页面** - 用户了解功能并开始制作
2. **信息收集** - 填写个人信息和教育背景
3. **AI推荐** - 基于专业背景推荐相关技能
4. **简历编辑** - 进入您现有的编辑器完成简历

## 🤖 AI功能说明

### 有API Key时
- 使用真实的ChatGPT API进行智能推荐
- 基于用户专业背景生成个性化技能建议
- 成本约每次推荐 $0.01-0.02

### 无API Key时
- 自动降级为预设的专业推荐算法
- 基于专业类别提供相关技能推荐
- 完全免费使用

## 🔒 安全注意事项

1. **永远不要提交 `.env.local` 到版本控制**
2. **定期轮换API密钥**
3. **监控API使用量和费用**
4. **在生产环境使用环境变量而非文件**

## 📊 成本控制

- 每次AI推荐调用约消耗1500-2000 tokens
- GPT-3.5-turbo 价格约 $0.001/1K tokens
- 建议设置月度使用限额

## 🐛 故障排除

### AI功能不工作
1. 检查API Key是否正确设置
2. 检查网络连接
3. 查看浏览器控制台错误信息
4. 验证API Key是否有足够余额

### 样式问题
1. 确认Tailwind CSS正确安装
2. 检查PostCSS配置
3. 清除缓存重新启动

### 构建问题
1. 检查TypeScript类型错误
2. 确认所有依赖正确安装
3. 检查环境变量格式

## 📈 生产部署

### Vercel部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel

# 设置环境变量
vercel env add VITE_OPENAI_API_KEY
```

### Netlify部署
1. 连接Git仓库
2. 在环境变量中设置API Key
3. 构建命令：`npm run build`
4. 发布目录：`dist`

## 📞 支持

如遇问题，请检查：
1. 环境变量配置
2. 网络连接
3. API余额
4. 浏览器控制台错误

---
*享受制作专业简历的过程！* 🎉