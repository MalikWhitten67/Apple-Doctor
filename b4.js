fetch('https://expressjs.malikwhitten.repl.co/bulktrain')
.then((res)=>{
   if(!res.ok){
     throw new Error('cannot reach ai - is the api key valid?')
   }
  return res.json()
})
.then((r)=>{
  console.log(r)
})
