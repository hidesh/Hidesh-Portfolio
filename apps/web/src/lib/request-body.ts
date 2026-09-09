export class InvalidBody extends Error {}

export async function readJsonBody(
  request: Request,
  maxBytes = 32_768
): Promise<unknown> {
  if (!request.headers.get('content-type')?.includes('application/json'))
    throw new InvalidBody('Expected JSON')
  const reader = request.body?.getReader()
  if (!reader) throw new InvalidBody('Missing body')
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > maxBytes) {
        await reader.cancel()
        throw new InvalidBody('Request too large')
      }
      chunks.push(value)
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch (error) {
    if (error instanceof InvalidBody) throw error
    throw new InvalidBody('Invalid JSON')
  } finally {
    reader.releaseLock()
  }
}
