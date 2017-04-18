#!/usr/bin/env node
const path = require('path')
const firstArg = process.argv[2]

switch(firstArg){
  case 'copy':require('./copy');break

  default:throw new Error('Unknown command')
}
