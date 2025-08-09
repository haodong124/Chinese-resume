// 本地存储工具函数
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(key, serializedData)
  } catch (error) {
    console.error('保存到本地存储失败:', error)
  }
}

export const loadFromLocalStorage = (key: string): any => {
  try {
    const serializedData = localStorage.getItem(key)
    if (serializedData === null) {
      return null
    }
    return JSON.parse(serializedData)
  } catch (error) {
    console.error('从本地存储加载失败:', error)
    return null
  }
}