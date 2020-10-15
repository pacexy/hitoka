// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const path = require('path')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'formatJSON... Remove this comment to see the full error message
function formatJSON(object: any) {
  const json = JSON.stringify(object, null, '  ')
  return `${json}\n`
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'writeTempl... Remove this comment to see the full error message
function writeTemplate(destFileName: any) {
  console.log(`Writing ${destFileName}...`)

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
  const src = path.join(__dirname, '../template', `${destFileName}.temp`)
  const dest = path.resolve(destFileName)

  fs.copyFileSync(src, dest)
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  formatJSON,
  writeTemplate,
}
