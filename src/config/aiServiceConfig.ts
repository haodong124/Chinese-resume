// ============================================
// src/config/aiServiceConfig.ts - 新增配置文件
// ============================================

export interface AIServiceConfig {
  useNewArchitecture: boolean
  enableISVValidation: boolean
  enableEventBus: boolean
  enableFusionEngine: boolean
  maxRetries: number
  timeoutMs: number
  debugMode: boolean
}

export const aiServiceConfig: AIServiceConfig = {
  useNewArchitecture: true,
  enableISVValidation: true,
  enableEventBus: true,
  enableFusionEngine: true,
  maxRetries: 3,
  timeoutMs: 30000,
  debugMode: import.meta.env.DEV
}

// 环境变量覆盖
if (import.meta.env.VITE_AI_USE_LEGACY === 'true') {
  aiServiceConfig.useNewArchitecture = false
}

if (import.meta.env.VITE_AI_DEBUG === 'true') {
  aiServiceConfig.debugMode = true
}

export default aiServiceConfig
