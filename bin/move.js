const path = require('path')
const log = require('../log.function')
const ackPath = require('../js/index')

const fromPath = path.join(process.cwd(), process.argv[3])
const toPath = path.join(process.cwd(), process.argv[4])
const aPath = ackPath.method(fromPath)

aPath.isFile()
.then(result=>{
  if( result ){
    return aPath.File().moveTo(toPath)
  }

  return aPath.moveTo(toPath)
})
.then( ()=>log('moved', process.argv[3], 'to', process.argv[4]) )
.catch( e=>log.error(e) )