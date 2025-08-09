/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_ENABLE_AI_FEATURES?: string
  readonly VITE_AI_MODEL?: string
  readonly VITE_AI_MAX_TOKENS?: string
  readonly VITE_AI_TEMPERATURE?: string
  readonly VITE_BUILD_TIME?: string
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
