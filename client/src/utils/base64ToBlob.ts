export default function (blob: string, quality= 0.70){
  // @ts-ignore
  return new Promise((resolve, reject)=>{
    let img = new Image()
    if(blob) {
      if(blob.indexOf("data:image/png") !== -1){
        img.src = blob.replace("png", "jpeg") // png file not reduce file size when using canvas
      } else {
        img.src = blob
      }
      img.onload = function (e) {
        let canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
    
        let ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
        canvas.toBlob((blob) => {
          resolve(blob)
        }, "image/jpeg", quality)
    
      }
  
      img.onerror = function (e) {
        reject(new Error("error=-------------------------"))
      }
    }
    
  })
}
