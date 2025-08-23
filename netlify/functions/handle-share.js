// 处理分享链接点击
exports.handler = async (event, context) => {
  const { shareCode } = event.queryStringParameters || {}
  
  if (!shareCode) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '缺少分享码' })
    }
  }
  
  try {
    // 动态导入 Supabase
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    )
    
    // 获取分享链接信息
    const { data: shareLink, error: linkError } = await supabase
      .from('share_links')
      .select('*, resumes(*)')
      .eq('share_code', shareCode)
      .single()
    
    if (linkError || !shareLink) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: '无效的分享链接' })
      }
    }
    
    // 更新点击次数
    await supabase
      .from('share_links')
      .update({ click_count: shareLink.click_count + 1 })
      .eq('id', shareLink.id)
    
    await supabase
      .from('resumes')
      .update({ actual_clicks: shareLink.resumes.actual_clicks + 1 })
      .eq('id', shareLink.resume_id)
    
    // 检查是否达到解锁条件
    if (shareLink.resumes.actual_clicks + 1 >= shareLink.resumes.required_clicks) {
      await supabase
        .from('resumes')
        .update({ export_unlocked: true })
        .eq('id', shareLink.resume_id)
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: '感谢您的支持！',
        unlocked: shareLink.resumes.actual_clicks + 1 >= shareLink.resumes.required_clicks
      })
    }
  } catch (error) {
    console.error('处理分享失败:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '服务器错误' })
    }
  }
}
