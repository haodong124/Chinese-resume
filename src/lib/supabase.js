// 简单版本，不需要 TypeScript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// 动态导入，避免构建错误
let supabase = null

export async function getSupabase() {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      supabase = createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
      console.log('Supabase not available:', error)
    }
  }
  return supabase
}

// 保存简历数据
export async function saveResume(resumeData) {
  const client = await getSupabase()
  if (!client) {
    console.log('Supabase not initialized')
    return null
  }
  
  try {
    const { data, error } = await client
      .from('resumes')
      .insert([{ 
        resume_data: resumeData,
        created_at: new Date().toISOString()
      }])
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving resume:', error)
    return null
  }
}
