const fs = require('fs')
const path = require('path')

function formatJSON(object) {
  const json = JSON.stringify(object, null, '  ')
  return `${json}\n`
}

function writeTemplate(destFileName) {
  console.log(`Writing ${destFileName}...`)

  const src = path.join(__dirname, '../template', `${destFileName}.temp`)
  const dest = path.resolve(destFileName)

  fs.copyFileSync(src, dest)
}

module.exports = {
  formatJSON,
  writeTemplate,
}
