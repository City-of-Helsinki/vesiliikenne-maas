import http, { IncomingMessage, ServerResponse } from 'http'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import listen from 'test-listen'
import axios, { AxiosResponse } from 'axios'

const dummyApiContext = {
  previewModeEncryptionKey: '',
  previewModeId: '',
  previewModeSigningKey: '',
}

export const performRequest = async (
  handler: any,
  params: any,
): Promise<AxiosResponse> => {
  const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
    return apiResolver(req, res, params, handler, dummyApiContext)
  }

  const server = http.createServer(requestHandler)
  try {
    let response
    const url = await listen(server)
    try {
      response = await axios.get(url)
    } catch (e) {
      response = e.response
    }
    return response
  } finally {
    server.close()
  }
}
