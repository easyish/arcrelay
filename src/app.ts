import * as express from 'express'
import * as cors from "cors";
import * as index from './index'
// import { DecodedLogEvent, ZeroEx } from '0x.js';
// import { BigNumber } from '@0xproject/utils';
// import * as Web3 from 'web3';

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


    index.testAll()
    // let ethAmount = 0.5;
    // let wethDestAddress = "0x5409ed021d9299bf6814279a6a1411a7e866a631";
    //
    // index.convertWethAsync(ethAmount, wethDestAddress);
    //
    // let makerAddress:string = "0x5409ed021d9299bf6814279a6a1411a7e866a631";
    // let takerAddress:string = "0x6ecbe1db9ef729cbe972c83fb886247691fb6beb";
    //
    // let makerToken:string = "ZRX";
    // let takerToken:string = "WETH";
    //
    // let orderHash = index.createAsync(makerAddress, takerAddress, makerToken, takerToken);
    // console.log("orderHash = ");
    // console.log(orderHash);


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
    router.get('/', index.hw_get)

    router.post('/', jsonParser, (req, res) => {
      console.log(req.body);
      res.json({
        message: 'Hello World POST BOIII',
      })
    })

    this.express.use('/', router)

    //enable pre-flight
    router.options("*", cors(options));

    }
}

export default new App().express
