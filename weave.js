module.exports = {
  file:function(file){
    var File = require('./file')
    module.exports.file = function(file){return File(file)}
    return File(file)
  },
  path:function(path){
    var Path = require('./index')
    module.exports.path = function(path){return Path(path)}
    return Path(path)
  }
}