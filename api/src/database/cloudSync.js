import {redisConnect} from "./index";
import errorConsole from "../logger/errorConsole";

const { createClient } = require('redis');


function redisCloudConnect(){
	return new Promise( async (resolve, reject)=>{
		
		const client = createClient( {
			url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
		});
		
		await client.on('error', (err) => console.log('---------Redis Cloud Client Error-----------', err));
		console.log("redis cloud connected...")
		await client.connect();
		resolve(client)
		
	})
}

export function redisSync(direction){
	// direction  = localToCloud || cloudToLocal
	let keys = [
		{name:"users", get: "HGETALL", setMethod: "HSET", type: "hash"},
		{name:"posts", get: "HGETALL", setMethod: "HSET", type: "hash"},
		{name:"comments", get: "HGETALL", setMethod: "HSET", type: "hash"},
		{name:"post_hits", get: "HGETALL", setMethod: "HSET", type: "hash"},
		{name:"app_visitor", get: "GET",  setMethod: "sAdd", type: "set"}, // set
		{name:"day_visitor", get: "GET", setMethod: "SET", type: "string"} // str
	]
	
	return new Promise((r, e)=>{
		
		keys.forEach((key)=>{
			(async function (){
				try{
					
					let localClient;
					let CloudClient;
					
					if(direction === "localToCloud"){
						localClient = await redisConnect()
						CloudClient = await redisCloudConnect()
						
						
					} else if (direction === "cloudToLocal") {
						localClient = await redisCloudConnect()
						CloudClient = await redisConnect()
					} else{
						console.log("wrong sync direction")
					}
					
					if(key.type === "hash") {
						let hash = await localClient[key.get](key.name)
						for(let hashKey in hash){
							let isSet =  await CloudClient[key.setMethod](key.name, hashKey, hash[hashKey])
						}
						console.log(`sync local to cloud ${key.name}`)
						
					} else if(key.type === "set"){
						
						let setList = await localClient.SMEMBERS("app_visitor")
						if(setList && setList.length > 0){
							setList.forEach(mem=>{
								CloudClient[key.setMethod](key.name, mem)
									.then(result=>{})
									.catch(ex=>{
										errorConsole(ex)
									})
							})
							
						}
						
						console.log(`sync local to cloud ${key.name}`)
					} else if(key.type === "string"){
						let strData = await localClient[key.get](key.name)
						
						if(strData){
							let isSet = await CloudClient[key.setMethod](key.name, strData)
							if(isSet){
								console.log(`sync local to cloud ${key.name}`)
							}
						}
					}
					r("yes")
					
				} catch (ex){
					e(ex)
				}
			}())
		})
	})
}


