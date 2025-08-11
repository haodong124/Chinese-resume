import { Handler } from '@netlify/functions'

interface FeedbackData {
  name?: string
  email?: string
  rating: number
  comment: string
  isPublic: boolean
  aiSkillMatch?: string
  contentQuality?: string
  sitePerformance?: string
  recommendation?: string
  aiAdvantages?: string[]
  aiImprovements?: string[]
  siteIssues?: string[]
  timestamp: string
}

const handler: Handler = async (event, context) => {
  // 处理 CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod === 'POST') {
    try {
      const feedbackData: FeedbackData = JSON.parse(event.body || '{}')
      
      // 验证必需字段
      if (!feedbackData.rating || !feedbackData.comment) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' })
        }
      }

      // 方案1: 发送邮件给您（推荐）
      await sendEmailNotification(feedbackData)

      // 方案2: 存储到文件或数据库
      await storeFeedback(feedbackData)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Feedback received successfully' 
        })
      }

    } catch (error) {
      console.error('Error processing feedback:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Internal server error' })
      }
    }
  }

  // GET 请求 - 获取公开评价
  if (event.httpMethod === 'GET') {
    try {
      const publicFeedbacks = await getPublicFeedbacks()
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(publicFeedbacks)
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Internal server error' })
      }
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  }
}

// 发送邮件通知
async function sendEmailNotification(feedback: FeedbackData) {
  // 使用 EmailJS 或其他邮件服务
  const emailData = {
    to: process.env.ADMIN_EMAIL || 'your-email@example.com',
    subject: `新的用户反馈 - ${feedback.rating}星`,
    html: `
      <h2>简历生成器用户反馈</h2>
      <p><strong>评分:</strong> ${feedback.rating}/5 星</p>
      <p><strong>用户:</strong> ${feedback.name || '匿名'}</p>
      <p><strong>邮箱:</strong> ${feedback.email || '未提供'}</p>
      <p><strong>时间:</strong> ${new Date(feedback.timestamp).toLocaleString('zh-CN')}</p>
      
      <h3>评价内容:</h3>
      <p>${feedback.comment}</p>
      
      ${feedback.aiSkillMatch ? `<p><strong>AI技能匹配:</strong> ${feedback.aiSkillMatch}</p>` : ''}
      ${feedback.recommendation ? `<p><strong>推荐意愿:</strong> ${feedback.recommendation}</p>` : ''}
      
      <p><strong>是否公开显示:</strong> ${feedback.isPublic ? '是' : '否'}</p>
    `
  }

  // 这里可以集成邮件服务 API
  console.log('Email data prepared:', emailData)
}

// 存储反馈数据
async function storeFeedback(feedback: FeedbackData) {
  // 方案1: 存储到 GitHub Issues (推荐)
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
    await createGitHubIssue(feedback)
  }

  // 方案2: 存储到 Google Sheets
  // 方案3: 存储到数据库

  console.log('Feedback stored:', feedback)
}

// 创建 GitHub Issue 存储反馈
async function createGitHubIssue(feedback: FeedbackData) {
  const issueTitle = `用户反馈 - ${feedback.rating}星 - ${new Date(feedback.timestamp).toLocaleDateString()}`
  const issueBody = `
## 用户反馈详情

**评分:** ${feedback.rating}/5 ⭐
**用户:** ${feedback.name || '匿名用户'}
**邮箱:** ${feedback.email || '未提供'}
**时间:** ${new Date(feedback.timestamp).toLocaleString('zh-CN')}
**公开显示:** ${feedback.isPublic ? '✅ 同意' : '❌ 不同意'}

### 评价内容
${feedback.comment}

### 详细调研结果
${feedback.aiSkillMatch ? `- **AI技能匹配程度:** ${feedback.aiSkillMatch}` : ''}
${feedback.contentQuality ? `- **内容质量满意度:** ${feedback.contentQuality}` : ''}
${feedback.sitePerformance ? `- **网站流畅程度:** ${feedback.sitePerformance}` : ''}
${feedback.recommendation ? `- **推荐意愿:** ${feedback.recommendation}` : ''}

${feedback.aiAdvantages?.length ? `- **AI功能优点:** ${feedback.aiAdvantages.join(', ')}` : ''}
${feedback.aiImprovements?.length ? `- **改进建议:** ${feedback.aiImprovements.join(', ')}` : ''}
${feedback.siteIssues?.length ? `- **遇到问题:** ${feedback.siteIssues.join(', ')}` : ''}
  `

  try {
    const response = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: ['user-feedback', `${feedback.rating}-star`]
      })
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    console.log('GitHub issue created successfully')
  } catch (error) {
    console.error('Failed to create GitHub issue:', error)
  }
}

// 获取公开反馈（用于展示）
async function getPublicFeedbacks() {
  // 这里可以从 GitHub Issues、数据库或其他存储获取公开反馈
  // 暂时返回示例数据
  return [
    {
      id: '1',
      name: '张同学',
      rating: 5,
      comment: 'AI功能很棒，生成的简历很专业！',
      timestamp: new Date().toISOString()
    },
    {
      id: '2', 
      name: '李女士',
      rating: 4,
      comment: '界面很友好，操作简单，推荐给求职的朋友。',
      timestamp: new Date().toISOString()
    }
  ]
}

export { handler }
