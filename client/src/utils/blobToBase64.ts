
function blobToBase64(blob: Blob, cb: (arg0: string | ArrayBuffer | null) => void){
  let reader = new FileReader() 
  reader.onload = function(e: any){
    cb(e.target.result)
  }
  if(blob){
    reader.readAsDataURL(blob)
  } 
}

export default blobToBase64