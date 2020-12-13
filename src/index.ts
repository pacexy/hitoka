#!/usr/bin/env node

import child_process from 'child_process'
import fs from 'fs'
import { PackageJson } from 'type-fest'

import {
  formatJSON,
  writeTemplate,
  updatePackageJsonFieldInMemory,
  PrimitiveField,
  ArrayField,
  ObjectField,
} from './utils'

const pkgManager = 'yarn'
const pkgInstallCommand = 'install'

// eslint-disable-next-line node/no-unpublished-require, @typescript-eslint/no-var-requires
const pkg: PackageJson = require('../../package.json')
const destPkg: PackageJson = JSON.parse(
  fs.readFileSync('./package.json', { encoding: 'utf8' }),
)

function overrideMain() {
  console.log(`Modify main...`)

  updatePackageJsonFieldInMemory(
    destPkg,
    PrimitiveField.main,
    'build/src/index.js',
  )
}

function addScripts() {
  console.log(`Add scripts...`)

  updatePackageJsonFieldInMemory(destPkg, ObjectField.scripts, {
    dev: 'ts-node -r tsconfig-paths/register src/index.ts',
    // TODO: resolve tsc path alias
    build: 'tsc',
    format: 'prettier --write src/**/*.{ts,tsx}',
  })
}

function addFiles() {
  console.log(`Add files...`)

  updatePackageJsonFieldInMemory(destPkg, ArrayField.files, [
    '/build/src',
    '!/build/src/**/*.map',
  ])
}

function addEngines() {
  console.log(`Add engines...`)

  updatePackageJsonFieldInMemory(destPkg, ObjectField.engines, {
    node: '>=12.0.0',
  })
}

function addDevDependencies() {
  console.log(`Add devDependecies...`)
  const devDependencies = {
    [pkg.name!]: `^${pkg.version}`,
  }

  ;[
    '@types/jest',
    '@types/node',
    'jest',
    'ts-jest',
    'tsconfig-paths',
    'typescript',
  ].forEach((name) => (devDependencies[name] = pkg.devDependencies![name]))

  updatePackageJsonFieldInMemory(
    destPkg,
    ObjectField.devDependencies,
    devDependencies,
  )
}

function writePackageJson() {
  fs.writeFileSync('package.json', formatJSON(destPkg))
}

function install() {
  // on windows, spawn not works like linux, there are 3 solutions:
  // https://github.com/google/gts/issues/278
  // 1. add `.cmd` suffix
  // https://stackoverflow.com/questions/37459717/error-spawn-enoent-on-windows
  // 2. use {shell: true} in the options of spawn
  // 3. spawn('cmd', ['/s', '/c', ...args], options)
  child_process.spawnSync(pkgManager, [pkgInstallCommand], {
    shell: true,
    stdio: 'inherit',
  })
}

function init() {
  // generate files by templates
  writeTemplate('.gitignore')
  writeTemplate('.eslintrc.js')
  writeTemplate('.prettierrc.js')
  writeTemplate('tsconfig.json')
  writeTemplate('jest.config.js')

  // modify `package.json`
  overrideMain()
  addScripts()
  addFiles()
  addEngines()
  addDevDependencies()

  writePackageJson()
  install()
}

init()
