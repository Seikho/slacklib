import * as req from 'needle'

export type Response<T> = {
  status: number
  statusMessage: string
} & T

export type Form = {
  token: string
  [key: string]: any
}

export async function post<T>(url: string, form: Form) {
  const opts: req.NeedleOptions = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const result = await get<{ ok: boolean; error?: string } & T>(url, opts, 'post', { ...form })
  if (!result.ok) {
    const urlEnd = url.split('/').slice(-1)[0]
    throw new Error(`Failed to POST /${urlEnd}: ${result.error || 'No error supplied'}`)
  }
  return result
}

export async function get<T>(
  url: string,
  options: req.NeedleOptions,
  method: 'get' | 'post',
  form: {}
): Promise<Response<T>> {
  const result = await req(method, url, form, options)
  return {
    status: result.statusCode,
    statusMessage: result.statusMessage,
    ...result.body
  }
}
