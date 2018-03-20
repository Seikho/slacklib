export type Item<T> = () => Promise<T>

const _queue: InternalItem[] = []

interface InternalItem {
  resolve: Function
  reject: Function
  item: Item<any>
}

export function queue<T>(item: Item<T>) {
  const promise = new Promise<T>((resolve, reject) => {
    _queue.push({
      resolve,
      reject,
      item
    })
  })
  return promise
}

async function run() {
  const item = _queue.shift()
  if (!item) {
    await sleep(1000)
    run()
    return
  }

  try {
    const result = await item.item()
    item.resolve(result)
  } catch (ex) {
    item.reject(ex)
  } finally {
    await sleep(1000)
    run()
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

run()
