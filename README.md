# Chinese Resume Builder - 中文简历制作工具

一个基于 React + TypeScript + Vite 的现代化中文简历制作工具，支持多模板、实时预览、PDF导出和数据持久化。

## ✨ 功能特点

- 🎨 **多模板支持**: 4种专业模板（现代简约、经典传统、创意设计、极简风格）
- 📱 **响应式设计**: 完美支持桌面端和移动端设备
- ⚡ **实时预览**: 左侧编辑，右侧实时预览效果
- 📄 **多格式导出**: 支持PDF、PNG、JPEG格式导出
- 💾 **数据持久化**: 自动保存到本地，支持数据导入导出
- 🔧 **完整字段**: 个人信息、工作经历、项目经历、教育背景、技能、证书
- 🎯 **专业优化**: 专为中文简历制作优化的用户体验

## 🚀 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **图标库**: Lucide React
- **PDF导出**: html2canvas + jsPDF
- **打印支持**: react-to-print

## 📦 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装和运行

```bash
# 克隆项目
git clone <your-repo-url>
cd chinese-resume-builder

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview