import * as index from './index';

export const helloworld_get = async (req:any, res:any) => {
  // console.log("we're calling hw_console.");
  res.json({
    res: 'Hello World GET'
  })
}

export const helloworld_post = async (req:any, res:any) => {
  // console.log(req.body);
  res.json({
    res: 'Hello World POST',
  })
}

export const convertWethAsyncCaller = async (req:any, res:any) => {
  let ethAmount:number = req.body.ethAmount; //0.5;
  let wethDestAddress:string = req.body.wethDestAddress; //"0x6ecbe1db9ef729cbe972c83fb886247691fb6beb";

  index.convertWethAsync(ethAmount, wethDestAddress);

  res.json({
    message: 'convertWethAsync success'
  })
};


export const createAsyncCaller = async (req:any, res:any) => {
  let makerAddress:string = req.body.makerAddress; //"0x5409ed021d9299bf6814279a6a1411a7e866a631";
  let takerAddress:string = req.body.takerAddress; //"0x6ecbe1db9ef729cbe972c83fb886247691fb6beb";

  let makerToken:string = req.body.makerToken; //"ZRX";
  let takerToken:string = req.body.takerToken; //"WETH";
  let resp:any = await index.createAsync(makerAddress, takerAddress, makerToken, takerToken);

  let orderHash:string = resp[0];
  let order:any = resp[1];

  res.json({
    orderHash: orderHash,
    order: order
  })
};

export const signAsyncCaller = async (req:any, res:any) => {
  let orderHash:string = req.body.orderHash;
  let makerAddress:string = req.body.makerAddress;
  let order:any = req.body.order;

  let signedOrder:any = await index.signAsync(orderHash, makerAddress, order);

  res.json({
    signedOrder: signedOrder,
  })
};

export const fillAsyncCaller = async (req:any, res:any) => {
  let signedOrder:any = req.body.signedOrder;
  let takerAddress:string = req.body.takerAddress;
  let fillAmount:number = req.body.fillAmount; //partial fill ?

  const txReceipt:any = await index.fillAsync(signedOrder, takerAddress, fillAmount);

  res.json({
    txReceipt: txReceipt,
  })
};
