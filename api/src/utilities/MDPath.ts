import path from "path";

/**
 * url = markdown\working_with_recursive_function.md
 * */


export function MDFilepath(url){
  return path.resolve(`src/${url}`)
  // D:\Code\my-doc-blog\server\src\markdown\working_with_recursive_function.md
}

export function MDDirpath(){
  return path.resolve(`src/markdown`)
  // D:\Code\my-doc-blog\server\src\markdown\working_with_recursive_function.md
}

export function DBDirpath(){
  return path.resolve(`src/database`)
  // D:\Code\my-doc-blog\server\src\markdown\working_with_recursive_function.md
}

