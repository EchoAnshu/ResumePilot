import { config } from '../config/index.js'
import { logger } from '../config/logger.js'

interface OllamaGenerateResponse {
  model: string
  createdAt: string
  response: string
  done: boolean
}

export async function queryOllama(
  prompt: string,
  model?: string,
): Promise<string> {
  const url = `${config.ollama.host}/api/generate`
  const usedModel = model || config.ollama.model

  logger.debug('Querying Ollama', { model: usedModel })

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: usedModel,
      prompt,
      stream: false,
    }),
    signal: AbortSignal.timeout(config.ollama.timeoutMs),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    logger.error('Ollama request failed', { status: response.status, body: text })
    throw new Error(`Ollama request failed with status ${response.status}`)
  }

  const data = (await response.json()) as OllamaGenerateResponse
  return data.response
}
