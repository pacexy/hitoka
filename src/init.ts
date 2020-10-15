// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const child_process = require('child_process')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'formatJSON... Remove this comment to see the full error message
const { formatJSON, writeTemplate } = require('./utils')

const pkgManager = 'yarn'
const pkgInstallCommand = 'install'

function generateESLintConfig() {
  writeTemplate('.eslintrc.js')
}

function generatePrettierConfig() {
  writeTemplate('.prettierrc.js')
}

function addDependencies() {
  console.log(`Add dependecies...`)

  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  const pkg = require('../package.json')
  const destPkg = JSON.parse(
    fs.readFileSync('./package.json', { encoding: 'utf8' }),
  )

  const deps = {
    [pkg.name]: `^${pkg.version}`,
  }

  if (!destPkg.devDependencies) {
    destPkg.devDependencies = {}
  }

  for (const depName of Object.keys(deps)) {
    // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
    destPkg.devDependencies[depName] = deps[depName]
  }

  fs.writeFileSync('package.json', formatJSON(destPkg))
}

function install() {
  // on windows, spawn not working like linux, there are 3 solutions:
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
  addDependencies()
  install()
}

init()
