export declare class Path {
    path: string;
    constructor(path: any);
    String(): any;
    getRecurArray(options?: any): any;
    getRecurPathReport(options?: any): any;
    /** overwrites files */
    copyTo(pathTo: any): Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
    /** move entire directory or single file */
    moveTo(newPath: any, overwrite: any): Promise<{}>;
    /** in-place rename directory or single file */
    rename(newname: any, overwrite: any): Promise<{}>;
    writeFile(output: any): Promise<{}>;
    /** performs .join but original object remains untouched */
    Join(...args: any[]): Path;
    file(name?: string): import("./file").File;
    sync(): any;
    getLastName(): any;
    getName: () => any;
    Path: any;
    File: (name?: string) => import("./file").File;
    noLastSlash(): this;
    noFirstSlash(): this;
    up(): this;
    join(...args: any[]): this;
    /** removes the file name from path */
    removeFile(): this;
    removeFileName: () => this;
    removeExt(): this;
    ext(ext: any): this;
    upEach(eachMethod: any): this;
    upNext(method: any): this;
    getDepth(): number;
    isDirectory(): Promise<{}>;
    /** hard-checks file system if item is a file */
    isFile(): Promise<{}>;
    isLikeFile(): boolean;
    exists(cbOrPath?: any, cb?: any): Promise<{}>;
    ifExists(pathOrCb: any, cbOrElse: any, els: any): this;
    /** creates folder if not defined. Takes into consideration if defined path is actually a file path
      Returns promise with context of this Path
    */
    paramDir(subPath?: any, options?: any): Promise<{}>;
    /** creates folder if not defined. Does not consider if defined path is actually a file path */
    param(subPath?: any, options?: any): Promise<{}>;
    delete(subPath?: string): Promise<any>;
    /** deletes folder. Takes into consideration if defined path is actually a file path */
    deleteDir(subPath: any): Promise<any>;
    getSubDirByName(subDirName: any): Path;
    getSubDirArray(): Promise<any>;
    /** returns names of subdirectories */
    getSubDirNameArray(): Promise<any>;
    /**
      @callback - function(Path path, parentValue, isFile)
      @options - see Path.each method
    */
    recur(callbackOrParentValue: any, callbackOrOptions: any, options: any): Promise<any[]>;
    eachSubDir(callback: any, last: any): this;
    nextSubDir(each: any): Promise<void>;
    fileSearchUp(fileName: any): any;
    /** Recursively loop folder to fire callback for each file found. see eachPath function */
    recurFiles(eachCall: any, options: any): Promise<any[]>;
    recurFilePath: (eachCall: any, options: any) => Promise<any[]>;
    /** Loop folder to fire callback for each file found. Only produces file results. see eachPath function */
    eachFilePath(eachCall: any, options: any): Promise<any[]>;
    /** see Path.prototype.each function
      @eachCall:function(Object:Path, Number:index)
    */
    eachPath(eachCall: any, options: any): Promise<any[]>;
    /** file/path looper.
      - Based on options, you can recursively read directories and/or files. returns promise
      - Runs using npm package readdir. See npm readdir for more usage instructions.
  
      @eachCall:function(String:path, Number:index)
      @options: (
        {
          recursive:true,
          INCLUDE_DIRECTORIES:true,
          INCLUDE_HIDDEN:true,
          filter:['** / **.js','** / **.jade']//!remove spaces from example!
  
          excludeByName:name=>yesNo
        }
      )
    */
    each(eachCall: any, options: any): Promise<any[]>;
    /** promise */
    eachSubDirName(callback: any): Promise<void>;
    static noLastSlash(path: any): any;
    static getName(p: any): any;
    /** hard-checks file system if item is a folder */
    static isDirectory(target: any): Promise<{}>;
    static isLikeFile(targetPath: any): boolean;
    /** creates folder if not defined. Does not consider if defined path is actually a file path */
    static param(folderPath: any, options: any): Promise<{}>;
    static delete(target: any): Promise<any>;
    static getFilterByReadOps(options: any): any;
}
export declare const method: (path: any) => Path;
export declare function isExistsError(e: any): boolean;
