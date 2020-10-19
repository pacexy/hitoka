import fs from 'fs'
import path from 'path'
import { PackageJson } from 'type-fest'

// eslint-disable-next-line @typescript-eslint/ban-types
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

function updatePackageJsonFieldInMemory(
  packageJson: PackageJson,
  fieldName: 'scripts' | 'devDependencies',
  fieldValue: Record<string, string>,
) {
  if (!packageJson[fieldName]) {
    packageJson[fieldName] = {}
  }

  for (const key of Object.keys(fieldValue)) {
    packageJson[fieldName]![key] = fieldValue[key]
  }
}

export { formatJSON, writeTemplate, updatePackageJsonFieldInMemory }
