function uuid() {
  return Math.floor(Math.random() * 100) + Date.now()
}

export default uuid