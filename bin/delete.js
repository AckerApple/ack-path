const path = require('path')
const log = require('../log.function')
const ackPath = require('../js/index')

const fromPath = path.join(process.cwd(), process.argv[3])
const aPath = ackPath.method(fromPath)

aPath.isFile()
.then(result=>{
  if( result ){
    return aPath.File().delete(fromPath)
  }

  return aPath.delete(fromPath)
})
.then( ()=>log('deleted', process.argv[3] ))
.catch( e=>log.error(e) )