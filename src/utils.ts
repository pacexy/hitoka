import fs from 'fs'
import path from 'path'
import { PackageJson } from 'type-fest'

// eslint-disable-next-line @typescript-eslint/ban-types
export function formatJSON(object: object) {
  const json = JSON.stringify(object, null, '\t')
  return `${json}\n`
}

export function writeTemplate(destFileName: string) {
  console.log(`Writing ${destFileName}...`)

  const src = path.join(__dirname, '../../template', `${destFileName}.tmp`)
  const dest = path.resolve(destFileName)

  fs.copyFileSync(src, dest)
}

export enum ArrayField {
  files = 'files',
}
export enum ObjectField {
  scripts = 'scripts',
  devDependencies = 'devDependencies',
}

function updatePackageJsonArrayFieldInMemory(
  packageJson: PackageJson,
  fieldName: ArrayField,
  fieldValue: string[],
) {
  if (!packageJson[fieldName]) {
    packageJson[fieldName] = []
  }

  packageJson[fieldName] = [...packageJson[fieldName]!, ...fieldValue]
}

function updatePackageJsonObjectFieldInMemory(
  packageJson: PackageJson,
  fieldName: ObjectField,
  fieldValue: Record<string, string>,
) {
  if (!packageJson[fieldName]) {
    packageJson[fieldName] = {}
  }

  for (const key of Object.keys(fieldValue)) {
    packageJson[fieldName]![key] = fieldValue[key]
  }
}

type FieldValue<T> = T extends ArrayField
  ? string[]
  : T extends ObjectField
  ? Record<string, string>
  : never

function isArrayField(fieldName: string): fieldName is ArrayField {
  return Object.keys(ArrayField).includes(fieldName)
}

function isObjectField(fieldName: string): fieldName is ObjectField {
  return Object.keys(ObjectField).includes(fieldName)
}

export function updatePackageJsonFieldInMemory<
  T extends ArrayField | ObjectField
>(packageJson: PackageJson, fieldName: T, fieldValue: FieldValue<T>) {
  if (isArrayField(fieldName)) {
    updatePackageJsonArrayFieldInMemory(
      packageJson,
      fieldName,
      // TODO: don not use assertion
      fieldValue as string[],
    )
    return
  }
  if (isObjectField(fieldName)) {
    updatePackageJsonObjectFieldInMemory(
      packageJson,
      fieldName,
      // TODO: don not use assertion
      fieldValue as Record<string, string>,
    )
  }
}
