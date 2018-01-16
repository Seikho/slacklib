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

  const result = await get<T>(url, opts, 'post', { ...form })
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
