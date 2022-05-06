export function sync(data: {}[], collectionName: string, key: string, client: any){
  data.forEach(async d=>{
    let p = await client.HSET(collectionName, d[key], JSON.stringify(d))
    console.log(p)
  })
}

export function getHashData(collectionName: string, client: any){
  return new Promise<any[]>(async (r, e)=>{
    try {
      let dataStr = await client.HGETALL(collectionName)
      if(dataStr) {
        r(redisHasToArr(dataStr))
      } else {
        e([])
      }
    } catch (ex){
      e([])
    }
  })
}

export function redisHasToArr(hashData) {
  let arr = []
  if(hashData){
    for (const hashDataKey in hashData) {
      let post = hashData[hashDataKey]
      arr.push(JSON.parse(post))
    }
  }
  return arr
}
