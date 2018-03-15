import api from './api'

const port = process.env.PORT || 3000

api.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})
