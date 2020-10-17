#!/usr/bin/env node

import child_process from 'child_process'
import fs from 'fs'
import { PackageJson } from 'type-fest'

import { formatJSON, writeTemplate } from './utils'

const pkgManager = 'yarn'
const pkgInstallCommand = 'install'

function generateESLintConfig() {
  writeTemplate('.eslintrc.js')
}

function generatePrettierConfig() {
  writeTemplate('.prettierrc.js')
}

function generateTSConfig() {
  writeTemplate('tsconfig.json')
}

function addDependencies() {
  console.log(`Add dependecies...`)

  // eslint-disable-next-line node/no-unpublished-require
  const pkg: PackageJson = require('../../package.json')
  const destPkg: PackageJson = JSON.parse(
    fs.readFileSync('./package.json', { encoding: 'utf8' }),
  )

  const deps: Record<string, string> = {
    [pkg.name!]: `^${pkg.version}`,
    // TODO: add devdeps with spawn
    typescript: pkg.devDependencies!.typescript,
    '@types/node': pkg.devDependencies!['@types/node'],
  }

  if (!destPkg.devDependencies) {
    destPkg.devDependencies = {}
  }

  for (const depName of Object.keys(deps)) {
    destPkg.devDependencies[depName] = deps[depName]
  }

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
  generateESLintConfig()
  generatePrettierConfig()
  generateTSConfig()
  addDependencies()
  install()
}

init()
