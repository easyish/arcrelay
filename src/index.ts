import { DecodedLogEvent, ZeroEx } from '0x.js';
import { BigNumber } from '@0xproject/utils';
import { TransactionReceiptWithDecodedLogs } from '@0xproject/types';
import * as Web3 from 'web3';


const TESTRPC_NETWORK_ID = 50;

//TODO: encapsulate this into "create", "sign", and "fill" functions
// (figure out if/how this can be done asynchronously)

//TODO: figure out how to call these functions from javascript code inside index.html

//TODO: Read through the OrderWatcher documentation and use it to implement order pruning

//TODO Have create, sign, fill order functionality working through html page with amounts, token types, and addresses being input

//TODO: Abstract the order creation code to work for any ERC20 token, or at least a much larger subset (current code just does ZRX <=> ETH)

//TODO:Error handling for "Error: Invalid JSON RPC response: " --- this means testRPC is not running

//
//instantiate a zeroEx instance
//
// create a provider pointing to local TestRPC on default port 8545
const provider = new Web3.providers.HttpProvider('http://localhost:8545');

// set configs
const configs = {
    networkId: TESTRPC_NETWORK_ID,
};
const zeroEx = new ZeroEx(provider, configs);


// set contract and exchange addresses
const WETH_ADDRESS = zeroEx.etherToken.getContractAddressIfExists() as string; // The wrapped ETH token contract
const ZRX_ADDRESS = zeroEx.exchange.getZRXTokenAddress(); // The ZRX token contract
// The Exchange.sol address (0x exchange smart contract)
const EXCHANGE_ADDRESS = zeroEx.exchange.getContractAddress();



//Ethereum Virtual Machine doesn't use decimals so we need to set DECIMALS
//to convert our amounts with BigNumber()
// Number of decimals to use (for ETH and ZRX)
const DECIMALS = 18;

export const logAddressesAsync = async () => {
    try {
        const availableAddresses = await zeroEx.getAvailableAddressesAsync();
        console.log("Accounts:", availableAddresses);
        return availableAddresses;
    } catch (error) {
        console.log( error);
        return [];
    }
};


//call this with taker address before generating order
export const convertWethAsync = async (intEthAmount:number, wethDestAddress :string) => {
  // Deposit WETH
  const ethAmount = new BigNumber(intEthAmount);
  const ethToConvert = ZeroEx.toBaseUnitAmount(ethAmount, DECIMALS); // Number of ETH to convert to WETH

  const convertEthTxHash = await zeroEx.etherToken.depositAsync(WETH_ADDRESS, ethToConvert, wethDestAddress);
  const txReceipt = await zeroEx.awaitTransactionMinedAsync(convertEthTxHash);
  console.log('${ethAmount} ETH -> WETH conversion mined...');
  console.log('Eth2Weth transaction receipt: ', txReceipt);

  return txReceipt;
};


export const createAsync = async (makerAddress:string, takerAddress:string, makerToken:string, takerToken:string) => { //add amount and buy/sell token and expiration time

  //switch makerToken
  //case "ZRX": makerTokenContractAddress = "ZRX_ADDRESS"
  //case "WETH": makerTokenContractAddress = "WETH_ADDRESS"


    //switch takerToken
      //case "ZRX": takerTokenContractAddress = "ZRX_ADDRESS"
      //case "WETH": takerTokenContractAddress = "WETH_ADDRESS"

  //then just replace ZRX_ADDRESS and WETH_ADDRESS below with maker and takerTokenContractAddress

    //hard code in accounts from testRPC:  (replace with user input addresses later )
    // Getting list of accounts
    const availableAddresses = await zeroEx.getAvailableAddressesAsync();

    // const takerAddress = "0x0000000000000000000000000000000000000000"

    //set allowances
    // Unlimited allowances to 0x proxy contract for maker and taker
    const setMakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(ZRX_ADDRESS, makerAddress);
    await zeroEx.awaitTransactionMinedAsync(setMakerAllowTxHash);

    const setTakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(WETH_ADDRESS, takerAddress);
    await zeroEx.awaitTransactionMinedAsync(setTakerAllowTxHash);
    console.log('Taker allowance mined...');

    // Generate order
    const order = {
        maker: makerAddress,
        taker: ZeroEx.NULL_ADDRESS,
        feeRecipient: ZeroEx.NULL_ADDRESS,
        makerTokenAddress: ZRX_ADDRESS,
        takerTokenAddress: WETH_ADDRESS,
        exchangeContractAddress: EXCHANGE_ADDRESS,
        salt: ZeroEx.generatePseudoRandomSalt(),
        makerFee: new BigNumber(0),
        takerFee: new BigNumber(0),
        makerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(0.2), DECIMALS), // Base 18 decimals
        takerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(0.3), DECIMALS), // Base 18 decimals
        expirationUnixTimestampSec: new BigNumber(Date.now() + 3600000), // Valid for up to an hour
    };

    // Create orderHash
    const orderHash = ZeroEx.getOrderHashHex(order);

    //remove
    console.log("orderHash = ", orderHash, "\n");

    // const unsignedOrder = {
    //     order: order,
    //     orderHash: orderHash,
    // };

    return [orderHash, order];
};

export const signAsync = async (orderHash:string, makerAddress:string, order:any) => {
  // Signing orderHash -> ecSignature
  const shouldAddPersonalMessagePrefix = false;
  const ecSignature = await zeroEx.signOrderHashAsync(orderHash, makerAddress, shouldAddPersonalMessagePrefix);

  // Appending signature to order
  const signedOrder = {
      ...order,
      ecSignature,
  };

  return signedOrder;
};



export const fillAsync = async (signedOrder:any, takerAddress:string, fillAmount:number) => {

    // Verify that order is fillable
    await zeroEx.exchange.validateOrderFillableOrThrowAsync(signedOrder);

    // Try to fill order
    const shouldThrowOnInsufficientBalanceOrAllowance = true;
    const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(fillAmount), DECIMALS);

    // Filling order
    const txHash = await zeroEx.exchange.fillOrderAsync(
        signedOrder,
        fillTakerTokenAmount,
        shouldThrowOnInsufficientBalanceOrAllowance,
        takerAddress,
    );

    // Transaction receipt
    const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash);
    console.log('FillOrder transaction receipt: ', txReceipt);
    //should probably return 0 or -1 success or failure or something

    return txReceipt;
}


// const testRpcAccounts = logAddressesAsync();
// console.log("RPC accts: ", testRpcAccounts);

// // Set maker and takers to the first 2 things in the testRPC accounts
//     const [makerAddress, takerAddress] = accounts;

export const testAll = async () => {
    let ethAmount = 0.5;
    let wethDestAddress = "0x6ecbe1db9ef729cbe972c83fb886247691fb6beb";

    await convertWethAsync(ethAmount, wethDestAddress);

    let makerAddress:string = "0x5409ed021d9299bf6814279a6a1411a7e866a631";
    let takerAddress:string = "0x6ecbe1db9ef729cbe972c83fb886247691fb6beb";

    let makerToken:string = "ZRX";
    let takerToken:string = "WETH";

    let resp:any = await createAsync(makerAddress, takerAddress, makerToken, takerToken);

    let orderHash:string = resp[0];
    let order:any = resp[1];

    await console.log("OH = ", orderHash);
    await console.log("order = ", order);

    let signedOrder:any = await signAsync(orderHash, makerAddress, order);

    console.log("SignedOrder = ", signedOrder);

    let fillAmount = 0.2; // partial fill
    const txReceipt:any = await fillAsync(signedOrder, takerAddress, fillAmount);

}
