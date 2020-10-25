#!/usr/bin/env node

import child_process from 'child_process'
import fs from 'fs'
import { PackageJson } from 'type-fest'

import {
  formatJSON,
  writeTemplate,
  updatePackageJsonFieldInMemory,
} from './utils'

const pkgManager = 'yarn'
const pkgInstallCommand = 'install'

// eslint-disable-next-line node/no-unpublished-require, @typescript-eslint/no-var-requires
const pkg: PackageJson = require('../../package.json')
const destPkg: PackageJson = JSON.parse(
  fs.readFileSync('./package.json', { encoding: 'utf8' }),
)

function generateGitIgnore() {
  writeTemplate('.gitignore')
}

function generateESLintConfig() {
  writeTemplate('.eslintrc.js')
}

function generatePrettierConfig() {
  writeTemplate('.prettierrc.js')
}

function generateTSConfig() {
  writeTemplate('tsconfig.json')
}

function addScripts() {
  console.log(`Add scripts...`)

  updatePackageJsonFieldInMemory(destPkg, 'scripts', {
    build: 'tsc',
    prepare: 'npm run build',
  })
}

function addDevDependencies() {
  console.log(`Add devDependecies...`)

  updatePackageJsonFieldInMemory(destPkg, 'devDependencies', {
    '@types/node': pkg.devDependencies!['@types/node'],
    [pkg.name!]: `^${pkg.version}`,
    // TODO: add devdeps with spawn
    typescript: pkg.devDependencies!.typescript,
  })
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
  generateGitIgnore()
  generateESLintConfig()
  generatePrettierConfig()
  generateTSConfig()
  addScripts()
  addDevDependencies()
  writePackageJson()
  install()
}

init()
