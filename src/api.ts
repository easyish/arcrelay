import * as express from 'express'
import * as cors from "cors";
import * as callbacks from './callbacks';
import { testAll } from './contracts';


let bodyParser = require('body-parser');

// create application/json parser
let jsonParser = bodyParser.json()



class API {
  public express

  constructor () {
    this.express = express();

    this.mountRoutes();

  }

  private mountRoutes (): void {
    const router = express.Router()

    const options:cors.CorsOptions = {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: 'http://localhost:8080',
      preflightContinue: false
    };

    //use cors middleware
    router.use(cors(options));

    //add routes

    //4 main post endpoints
    router.post('/api/convert', jsonParser, callbacks.convertWethAsyncCaller);
    router.post('/api/create', jsonParser, callbacks.createAsyncCaller);
    router.post('/api/sign', jsonParser, callbacks.signAsyncCaller);
    router.post('/api/fill', jsonParser, callbacks.fillAsyncCaller);

    this.express.use('/', router)

    //enable pre-flight
    router.options("*", cors(options));

    }
}

export default new API().express
