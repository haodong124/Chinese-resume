// Supabase 客户端配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseClient = null

// 获取 Supabase 客户端
export async function getSupabase() {
  if (!supabaseClient && supabaseUrl && supabaseAnonKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
      console.log('✅ Supabase 初始化成功')
    } catch (error) {
      console.error('❌ Supabase 初始化失败:', error)
    }
  }
  return supabaseClient
}

// 查找或创建用户
export async function findOrCreateUser(email, name, phone) {
  const supabase = await getSupabase()
  if (!supabase) return null
  
  try {
    // 先查找用户
    let { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      console.log('找到现有用户:', existingUser.id)
      return existingUser
    }
    
    // 创建新用户
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{
        email: email,
        name: name,
        phone: phone
      }])
      .select()
      .single()
    
    if (createError) throw createError
    
    console.log('创建新用户:', newUser.id)
    return newUser
  } catch (error) {
    console.error('用户操作失败:', error)
    return null
  }
}

// 保存简历
export async function saveResume(userId, resumeData, templateType) {
  const supabase = await getSupabase()
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('resumes')
      .insert([{
        user_id: userId,
        resume_data: resumeData,
        template_type: templateType || 'standard',
        required_clicks: 3 // 需要3次分享点击
      }])
      .select()
      .single()
    
    if (error) throw error
    
    console.log('✅ 简历保存成功:', data.id)
    return data
  } catch (error) {
    console.error('❌ 保存简历失败:', error)
    return null
  }
}

// 生成分享链接
export async function generateShareLink(resumeId) {
  const supabase = await getSupabase()
  if (!supabase) return null
  
  try {
    // 生成更长的唯一分享码，避免冲突
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 10)
    const shareCode = `${timestamp}${randomStr}`
    
    const { data, error } = await supabase
      .from('share_links')
      .insert([{
        resume_id: resumeId,
        share_code: shareCode,
        click_count: 0
      }])
      .select()
      .single()
    
    if (error) throw error
    
    // 构建分享链接
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/share/${shareCode}`
    
    console.log('✅ 分享链接生成:', shareUrl)
    return { ...data, shareUrl, shareCode }
  } catch (error) {
    console.error('❌ 生成分享链接失败:', error)
    return null
  }
}

// 记录分享点击
export async function recordShareClick(shareCode) {
  const supabase = await getSupabase()
  if (!supabase) return null
  
  try {
    // 获取分享链接信息
    const { data: shareLink, error: linkError } = await supabase
      .from('share_links')
      .select('*, resumes(*)')
      .eq('share_code', shareCode)
      .single()
    
    if (linkError || !shareLink) {
      console.error('无效的分享链接:', linkError)
      return null
    }
    
    // 记录点击
    const { error: clickError } = await supabase
      .from('share_clicks')
      .insert([{
        share_link_id: shareLink.id,
        visitor_ip: null, // 可以在后端获取
        is_valid: true
      }])
    
    if (clickError) {
      console.error('记录点击失败:', clickError)
      // 继续执行，不影响计数
    }
    
    // 更新点击计数
    const newShareClickCount = (shareLink.click_count || 0) + 1
    await supabase
      .from('share_links')
      .update({ click_count: newShareClickCount })
      .eq('id', shareLink.id)
    
    // 更新简历的实际点击数
    const newResumeClickCount = (shareLink.resumes?.actual_clicks || 0) + 1
    const requiredClicks = shareLink.resumes?.required_clicks || 3
    
    await supabase
      .from('resumes')
      .update({ 
        actual_clicks: newResumeClickCount,
        export_unlocked: newResumeClickCount >= requiredClicks
      })
      .eq('id', shareLink.resume_id)
    
    console.log(`✅ 记录点击成功，当前点击数: ${newResumeClickCount}/${requiredClicks}`)
    
    return {
      currentClicks: newResumeClickCount,
      requiredClicks: requiredClicks,
      isUnlocked: newResumeClickCount >= requiredClicks
    }
  } catch (error) {
    console.error('❌ 记录点击失败:', error)
    return null
  }
}

// 检查导出权限
export async function checkExportPermission(resumeId) {
  const supabase = await getSupabase()
  if (!supabase) return { canExport: true, currentClicks: 0, requiredClicks: 3 }
  
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('export_unlocked, actual_clicks, required_clicks')
      .eq('id', resumeId)
      .single()
    
    if (error) throw error
    
    return {
      canExport: data.export_unlocked || false,
      currentClicks: data.actual_clicks || 0,
      requiredClicks: data.required_clicks || 3
    }
  } catch (error) {
    console.error('检查权限失败:', error)
    // 出错时默认允许导出，避免影响用户体验
    return { canExport: true, currentClicks: 0, requiredClicks: 3 }
  }
}
