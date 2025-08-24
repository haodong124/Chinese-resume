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
    // 生成唯一的分享码
    const shareCode = Math.random().toString(36).substring(2, 10)
    
    const { data, error } = await supabase
      .from('share_links')
      .insert([{
        resume_id: resumeId,
        share_code: shareCode
      }])
      .select()
      .single()
    
    if (error) throw error
    
    // 构建分享链接
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/share/${shareCode}`
    
    console.log('✅ 分享链接生成:', shareUrl)
    return { ...data, shareUrl }
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
      console.error('无效的分享链接')
      return null
    }
    
    // 记录点击
    const { error: clickError } = await supabase
      .from('share_clicks')
      .insert([{
        share_link_id: shareLink.id
      }])
    
    if (clickError) throw clickError
    
    // 更新点击计数
    await supabase
      .from('share_links')
      .update({ click_count: shareLink.click_count + 1 })
      .eq('id', shareLink.id)
    
    // 更新简历的实际点击数
    const newClickCount = shareLink.resumes.actual_clicks + 1
    await supabase
      .from('resumes')
      .update({ 
        actual_clicks: newClickCount,
        export_unlocked: newClickCount >= shareLink.resumes.required_clicks
      })
      .eq('id', shareLink.resume_id)
    
    console.log(`✅ 记录点击成功，当前点击数: ${newClickCount}`)
    
    return {
      currentClicks: newClickCount,
      requiredClicks: shareLink.resumes.required_clicks,
      isUnlocked: newClickCount >= shareLink.resumes.required_clicks
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
      canExport: data.export_unlocked,
      currentClicks: data.actual_clicks,
      requiredClicks: data.required_clicks
    }
  } catch (error) {
    console.error('检查权限失败:', error)
    // 出错时默认允许导出，避免影响用户体验
    return { canExport: true, currentClicks: 0, requiredClicks: 3 }
  }
}
