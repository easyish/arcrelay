import * as express from 'express'
import * as cors from "cors";

class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()

    const options:cors.CorsOptions = {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: 'http://localhost:3000',
      preflightContinue: false
    };

    //use cors middleware
    router.use(cors(options));

    //add your routes
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World!'
      })
    })
    this.express.use('/', router)


    //enable pre-flight
    router.options("*", cors(options));
    }
}

export default new App().express
