#!/usr/bin/env node
const path = require('path')
const firstArg = process.argv[2]

switch(firstArg){
  case 'copy':
  case 'move':
  case 'delete':
    require('./'+firstArg);break

  default:throw new Error('Unknown command')
}
