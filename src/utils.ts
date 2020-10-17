import fs from 'fs'
import path from 'path'

function formatJSON(object: object) {
  const json = JSON.stringify(object, null, '\t')
  return `${json}\n`
}

function writeTemplate(destFileName: string) {
  console.log(`Writing ${destFileName}...`)

  const src = path.join(__dirname, '../../template', `${destFileName}.tmp`)
  const dest = path.resolve(destFileName)

  fs.copyFileSync(src, dest)
}

export { formatJSON, writeTemplate }
