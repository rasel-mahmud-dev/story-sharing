function errorConsole(ex){
  if(process.env.NODE_ENV === "development"){
    console.error(ex.message)
  }
}

export default errorConsole