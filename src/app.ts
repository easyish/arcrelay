import * as express from 'express'
import * as cors from "cors";
import * as index from './index'

let bodyParser = require('body-parser');
// let multer = require('multer');
// let upload = multer();


// create application/json parser
let jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })



class App {
  public express

  constructor () {
    this.express = express()

    // this.express.use(bodyParser.json());
    // this.express.use(bodyParser.urlencoded({
    //     extended: true
    // }));

    this.mountRoutes()
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

    //add your routes
    router.get('/', index.hw_get
    // (req, res) => {
    //   res.json({
    //     message: 'Hello World!'
    //   })
    // }
    )

    router.post('/', jsonParser, (req, res) => {
      // let i:number = req.body.some_integer;
      console.log(req.body);
      res.json({
        message: 'Hello World POST BOIII',
        // message2: req,
        // message3: req
      })
    })

    this.express.use('/', router)


    //enable pre-flight
    router.options("*", cors(options));

    }
}

export default new App().express
