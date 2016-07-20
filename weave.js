module.exports = {
  file:function(file){
    return require('./file')(file)
  },
  path:function(path){
    return require('./index')(path)
  }
}