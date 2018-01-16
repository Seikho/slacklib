export async function sleep(seconds: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(function() {
      resolve()
    }, seconds * 1000)
  })
}
