module.exports = function(){
  const args = Array.prototype.slice.call(arguments)
  args.unshift('\x1b[36m[ack-path]\x1b[0m')
  console.log.apply(console,args)
}

module.exports.error = function(){
  const args = Array.prototype.slice.call(arguments)
  args.unshift('\x1b[31m[ack-path]\x1b[0m')
  console.log.apply(console,args)
}

module.exports.warn = function(){
  const args = Array.prototype.slice.call(arguments)
  args.unshift('\x1b[33m[ack-path]\x1b[0m')
  console.log.apply(console,args)
}