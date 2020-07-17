import http, { IncomingMessage, ServerResponse } from 'http'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import listen from 'test-listen'
import axios, { AxiosResponse } from 'axios'
import { any } from 'io-ts'

const dummyApiContext = {
  previewModeEncryptionKey: '',
  previewModeId: '',
  previewModeSigningKey: '',
}

export const createRequestHandler = (handler: any, params: any) => (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  return apiResolver(req, res, params, handler, dummyApiContext)
}

export const performPost = async (
  url: string,
  params: any,
): Promise<AxiosResponse> => {
  let response
  try {
    response = await axios.post(url, params)
  } catch (error) {
    response = error.response
  }
  return response
}

export const performGet = async (url: string): Promise<AxiosResponse> => {
  let response
  try {
    response = await axios.get(url)
  } catch (error) {
    response = error.response
  }
  return response
}

export const performRequest = async (
  handler: any,
  params: any,
): Promise<AxiosResponse> => {
  const requestHandler = createRequestHandler(handler, params)
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
