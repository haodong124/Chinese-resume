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

// 简单的内存存储（重启后会丢失，适用于演示）
let feedbackStorage: FeedbackData[] = [
  // 初始示例数据
  {
    name: '张同学',
    rating: 5,
    comment: 'AI功能很棒，生成的简历很专业！推荐技能很准确，节省了很多时间。',
    isPublic: true,
    recommendation: 'definitely',
    timestamp: new Date(Date.now() - 86400000).toISOString() // 1天前
  },
  {
    name: '李女士',
    rating: 4,
    comment: '界面很友好，操作简单。希望能增加更多简历模板选择。',
    isPublic: true,
    recommendation: 'probably',
    timestamp: new Date(Date.now() - 172800000).toISOString() // 2天前
  },
  {
    name: '王工程师',
    rating: 5,
    comment: '技能推荐功能太实用了！发现了很多我忽略的技能点，简历质量提升很大。',
    isPublic: true,
    recommendation: 'definitely',
    timestamp: new Date(Date.now() - 259200000).toISOString() // 3天前
  }
]

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

      // 添加到存储
      feedbackStorage.unshift(feedbackData) // 新的反馈放在最前面
      
      // 控制台记录（您可以在 Netlify Functions 日志中查看）
      console.log('新收到用户反馈:', {
        rating: feedbackData.rating,
        user: feedbackData.name || '匿名',
        time: new Date(feedbackData.timestamp).toLocaleString('zh-CN'),
        comment: feedbackData.comment.substring(0, 50) + '...',
        isPublic: feedbackData.isPublic
      })

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Feedback received successfully',
          total: feedbackStorage.length
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
      // 只返回公开的评价，按时间倒序
      const publicFeedbacks = feedbackStorage
        .filter(feedback => feedback.isPublic)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20) // 最多返回20条
        .map(feedback => ({
          id: feedback.timestamp, // 使用时间戳作为ID
          name: feedback.name || '匿名用户',
          rating: feedback.rating,
          comment: feedback.comment,
          timestamp: feedback.timestamp
        }))
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          feedbacks: publicFeedbacks,
          total: publicFeedbacks.length,
          averageRating: publicFeedbacks.length > 0 
            ? (publicFeedbacks.reduce((sum, f) => sum + f.rating, 0) / publicFeedbacks.length).toFixed(1)
            : '0.0'
        })
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

export { handler }
