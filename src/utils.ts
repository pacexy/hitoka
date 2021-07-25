/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'

import _ from 'lodash'
import { PackageJson } from 'type-fest'

// eslint-disable-next-line @typescript-eslint/ban-types
export function formatJSON(object: object) {
  const json = JSON.stringify(object, null, '\t')
  return `${json}\n`
}

export function writeTemplate(destFileName: string) {
  console.log(`CREATE ${destFileName}`)

  const src = path.join(__dirname, '../..', destFileName)
  const dest = path.resolve(destFileName)

  fs.copyFileSync(src, dest)
}

export enum PrimitiveField {
  main = 'main',
}

export enum ArrayField {
  files = 'files',
}
export enum ObjectField {
  scripts = 'scripts',
  engines = 'engines',
  devDependencies = 'devDependencies',
}

function updatePackageJsonPrimitiveFieldInMemory(
  packageJson: PackageJson,
  fieldName: PrimitiveField,
  fieldValue: string,
) {
  packageJson[fieldName] ??= fieldValue
}

function updatePackageJsonArrayFieldInMemory(
  packageJson: PackageJson,
  fieldName: ArrayField,
  fieldValue: string[],
) {
  packageJson[fieldName] = _.uniq([
    ...(packageJson[fieldName] ?? []),
    ...fieldValue,
  ])
}

// eslint-disable-next-line @typescript-eslint/ban-types
function sortPropertiesByKey(object: object) {
  // https://github.com/lodash/lodash/issues/1459#issuecomment-253969771
  return _(object).toPairs().sortBy(0).fromPairs().value()
}

function updatePackageJsonObjectFieldInMemory(
  packageJson: PackageJson,
  fieldName: ObjectField,
  fieldValue: Record<string, string>,
) {
  packageJson[fieldName] ??= {}

  for (const key of Object.keys(fieldValue)) {
    packageJson[fieldName]![key] ??= fieldValue[key]
  }

  if (fieldName === ObjectField.devDependencies) {
    packageJson[fieldName] = sortPropertiesByKey(packageJson[fieldName]!)
  }
}

type FieldValue<T> = T extends PrimitiveField
  ? string
  : T extends ArrayField
  ? string[]
  : T extends ObjectField
  ? Record<string, string>
  : never

function isPrimitiveField(fieldName: string): fieldName is PrimitiveField {
  return Object.keys(PrimitiveField).includes(fieldName)
}

function isArrayField(fieldName: string): fieldName is ArrayField {
  return Object.keys(ArrayField).includes(fieldName)
}

function isObjectField(fieldName: string): fieldName is ObjectField {
  return Object.keys(ObjectField).includes(fieldName)
}

// TODO: inquirer
export function updatePackageJsonFieldInMemory<
  T extends PrimitiveField | ArrayField | ObjectField,
>(packageJson: PackageJson, fieldName: T, fieldValue: FieldValue<T>) {
  if (isPrimitiveField(fieldName)) {
    updatePackageJsonPrimitiveFieldInMemory(
      packageJson,
      fieldName,
      // TODO: don not use assertion
      fieldValue as string,
    )
    return
  }

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
