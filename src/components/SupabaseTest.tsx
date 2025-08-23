import React, { useState } from 'react'

const SupabaseTest = () => {
  const [testResult, setTestResult] = useState<string>('准备测试...')
  const [loading, setLoading] = useState(false)
  
  const testSupabase = async () => {
    setLoading(true)
    setTestResult('正在连接 Supabase...')
    
    try {
      // 动态导入 Supabase
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        setTestResult('❌ 环境变量未设置')
        return
      }
      
      // 创建 Supabase 客户端
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // 测试查询（即使表不存在也能测试连接）
      const { error } = await supabase.from('users').select('count').limit(1)
      
      if (error) {
        // 如果是表不存在的错误，说明连接成功
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          setTestResult('✅ Supabase 连接成功！（需要创建数据表）')
        } else {
          setTestResult(`⚠️ 连接成功但有错误: ${error.message}`)
        }
      } else {
        setTestResult('✅ Supabase 完全正常工作！')
      }
    } catch (err) {
      setTestResult(`❌ 测试失败: ${err}`)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      padding: '16px',
      zIndex: 10000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '300px',
      textAlign: 'center'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
        Supabase 连接测试
      </h3>
      
      <button
        onClick={testSupabase}
        disabled={loading}
        style={{
          padding: '8px 24px',
          background: loading ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          marginBottom: '12px'
        }}
      >
        {loading ? '测试中...' : '点击测试连接'}
      </button>
      
      <div style={{
        padding: '8px',
        background: '#f3f4f6',
        borderRadius: '4px',
        fontSize: '13px',
        wordBreak: 'break-word'
      }}>
        {testResult}
      </div>
    </div>
  )
}

export default SupabaseTest
