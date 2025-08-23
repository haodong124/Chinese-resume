// Supabase 客户端配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseClient = null

// 动态加载 Supabase（避免构建错误）
export async function getSupabase() {
  if (!supabaseClient && supabaseUrl && supabaseAnonKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
      console.log('Supabase 初始化成功')
    } catch (error) {
      console.error('Supabase 初始化失败:', error)
    }
  }
  return supabaseClient
}

// 保存用户信息
export async function saveUser(userInfo) {
  const supabase = await getSupabase()
  if (!supabase) return null
  
  try {
    // 先尝试查找用户
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('email', userInfo.email)
      .single()
    
    if (existingUser) {
      return existingUser
    }
    
    // 创建新用户
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userInfo.email,
        name: userInfo.name,
        phone: userInfo.phone
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('保存用户失败:', error)
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
        template_type: templateType || 'standard'
      }])
      .select()
      .single()
    
    if (error) throw error
    console.log('简历保存成功:', data.id)
    return data
  } catch (error) {
    console.error('保存简历失败:', error)
    return null
  }
}

// 生成分享链接
export async function generateShareLink(resumeId) {
  const supabase = await getSupabase()
  if (!supabase) return null
  
  try {
    // 生成随机分享码
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
    
    const shareUrl = `${import.meta.env.VITE_APP_URL}/share/${shareCode}`
    return { ...data, shareUrl }
  } catch (error) {
    console.error('生成分享链接失败:', error)
    return null
  }
}

// 检查导出权限
export async function checkExportPermission(resumeId) {
  const supabase = await getSupabase()
  if (!supabase) return { canExport: true } // 如果 Supabase 不可用，默认允许导出
  
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('export_unlocked, actual_clicks, required_clicks')
      .eq('id', resumeId)
      .single()
    
    if (error) throw error
    
    return {
      canExport: data.export_unlocked || data.actual_clicks >= data.required_clicks,
      currentClicks: data.actual_clicks,
      requiredClicks: data.required_clicks
    }
  } catch (error) {
    console.error('检查权限失败:', error)
    return { canExport: true } // 出错时默认允许
  }
}
