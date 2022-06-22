'use strict'

const autocannon = require('autocannon')
// async/await
async function foo () {
  const args = process.argv.slice(2)
  const instance = autocannon({
    // url: 'http://localhost:8080/api/posts',
    url: 'http://localhost:5500/api/posts',
    connections: args[0] || 1000, //default
    // maxConnections: args[1] || 1000,  // each user max connection
    // pipelining: 1, // default
    duration: 10, // default
    headers: {
      "content-type": "application/json"
    }
  }, handleFinished)
  
  // 1000,000 == 1M
  
  autocannon.track(instance)
  
  function handleFinished(err, res){
    
    console.log({
      url: res.url,
      connections: res.connections,
      statusCodeStats: res.statusCodeStats,
      "1xx": res["1xx"],
      "2xx": res["2xx"],
      "3xx": res["3xx"],
      "4xx": res["4xx"],
      errors: res.errors,
      latency: {
        totalCount: res.latency.totalCount
      }
    } )
  }
}

foo()