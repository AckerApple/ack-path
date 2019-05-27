/// <reference types="node" />
export declare class File {
    path: string;
    constructor(path: any);
    moveTo(newPath: any, overwrite: any): Promise<{}>;
    rename: (newPath: any, overwrite: any) => Promise<{}>;
    /** returns promise of File object that is targeted at created copy  */
    copyTo(pathTo: any): Promise<File>;
    /** Manipulates path by removing one file extension. Returns self */
    removeExt(): this;
    /** Creates new File instance with existing file path prepended. Leaves existing reference alone */
    Join(a: any, b: any, c: any): File;
    /** appends onto existing file path */
    join(a: any, b: any, c: any): this;
    requireIfExists(): Promise<any>;
    readJson(): Promise<any>;
    getJson: () => Promise<any>;
    ifExists(cb?: any, els?: any): Promise<{}>;
    Path(): import(".").Path;
    paramDir(): Promise<this>;
    stat(): Promise<{}>;
    getMimeType(): any;
    read(): Promise<{}>;
    readAsBase64(): Promise<string>;
    readAsString(): Promise<string>;
    getName(): string;
    append(output: any): Promise<{}>;
    write(output: any): Promise<{}>;
    /** just like write but if file already exists, no error will be thrown */
    param(output: any): Promise<{}>;
    delete(): Promise<{}>;
    exists(): Promise<{}>;
    sync(): FileSync;
}
export declare class FileSync {
    path: string;
    constructor(path: any);
    moveTo(pathTo: any): void;
    rename: (pathTo: any) => void;
    read(): Buffer;
    write(string: any, options: any): this;
    delete(): this;
    exists(): boolean;
    readJson(): any;
    readAsString(): string;
}
export declare const method: (path: any) => File;
export declare const Class: typeof File;
