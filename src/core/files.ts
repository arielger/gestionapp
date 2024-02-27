export async function streamToBuffer(doc: NodeJS.ReadableStream): Promise<Buffer> {
  const buffers: Buffer[] = []

  // Create a Promise to wait for the end event
  const endPromise = new Promise<void>((resolve, reject) => {
    doc.on("end", () => {
      resolve()
    })
    doc.on("error", (error) => {
      reject(error)
    })
  })

  doc.on("data", (chunk: Buffer) => {
    buffers.push(chunk)
  })

  await endPromise

  const finalBuffer = Buffer.concat(buffers)
  return finalBuffer
}
