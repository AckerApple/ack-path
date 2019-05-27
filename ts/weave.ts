import { method as File } from './file'
import { method as Path } from './index'

export const weave = {
  file:function(file){
    weave.file = function(file){return File(file)}
    return File(file)
  },
  path:function(path){
    weave.path = function(path){return Path(path)}
    return Path(path)
  }
}