import React from 'react'

const EnvDebug = () => {
  // 获取所有 VITE_ 开头的环境变量
  const envVars = Object.keys(import.meta.env)
    .filter(key => key.startsWith('VITE_'))
    .map(key => ({
      key,
      value: import.meta.env[key]
    }))
  
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'white',
      border: '2px solid red',
      padding: '10px',
      zIndex: 10000,
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <h3>环境变量调试</h3>
      {envVars.length > 0 ? (
        <ul>
          {envVars.map(({ key, value }) => (
            <li key={key}>
              <strong>{key}:</strong> {value ? `已设置 (${value.substring(0, 20)}...)` : '未设置'}
            </li>
          ))}
        </ul>
      ) : (
        <p>没有找到任何 VITE_ 环境变量</p>
      )}
      <hr />
      <p>MODE: {import.meta.env.MODE}</p>
      <p>DEV: {import.meta.env.DEV ? 'true' : 'false'}</p>
      <p>PROD: {import.meta.env.PROD ? 'true' : 'false'}</p>
    </div>
  )
}

export default EnvDebug
