// lib/apiKeyValidator.ts
/**
 * APIキーの検証とマスキング
 */
export function validateApiKey(
  key: string | undefined,
  serviceName: string
): string {
  if (!key || key.length < 20) {
    throw new Error(`${serviceName} API key is not configured properly`);
  }
  return key;
}

/**
 * デバッグ用：APIキーの一部のみ表示
 */
export function maskApiKey(key: string | undefined): string {
  if (!key) return "NOT_SET";
  return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
}
