import { StorageAdapter } from './adapter'
import { LocalStorageAdapter } from './local-adapter'
import { KVStorageAdapter } from './kv-adapter'

export function createStorageAdapter(env?: any): StorageAdapter {
  // 检查是否在生产环境且有KV绑定
  const isProduction = process.env.NODE_ENV === 'production'
  const hasKVStore = env && env.KV_STORE
  
  if (isProduction && hasKVStore) {
    console.log('使用KV存储适配器（生产环境）')
    return new KVStorageAdapter(env.KV_STORE)
  }
  
  console.log('使用本地存储适配器（开发环境）')
  return new LocalStorageAdapter()
}

// 导出单例实例
let storageInstance: StorageAdapter | null = null

export function getStorage(env?: any): StorageAdapter {
  if (!storageInstance) {
    storageInstance = createStorageAdapter(env)
  }
  return storageInstance
}

// 初始化存储
export async function initializeStorage(env?: any): Promise<void> {
  const storage = getStorage(env)
  await storage.initialize()
}