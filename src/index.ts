import { DecodedLogEvent, ZeroEx } from '0x.js';
import { BigNumber } from '@0xproject/utils';
import * as Web3 from 'web3';
import app from './App'


const port = process.env.PORT || 3000

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})


// import * as express from 'express';

// var express = require('express');
// var app = express();
// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });


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

const logAddressesAsync = async () => {
    try {
        const availableAddresses = await zeroEx.getAvailableAddressesAsync();
        console.log("Accounts:", availableAddresses);
        return availableAddresses;
    } catch (error) {
        console.log( error);
        return [];
    }
};

const mainAsync = async (makerAddress:string) => { //add amount and buy/sell token and expiration time

    //hard code in accounts from testRPC:  (replace with user input addresses later )
    // Getting list of accounts
    const availableAddresses = await zeroEx.getAvailableAddressesAsync();

    const takerAddress = "0x0000000000000000000000000000000000000000"

    //set allowances
    // Unlimited allowances to 0x proxy contract for maker and taker
    const setMakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(ZRX_ADDRESS, makerAddress);
    await zeroEx.awaitTransactionMinedAsync(setMakerAllowTxHash);

    const setTakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(WETH_ADDRESS, takerAddress);
    await zeroEx.awaitTransactionMinedAsync(setTakerAllowTxHash);
    console.log('Taker allowance mined...');

    // Deposit WETH
    const ethAmount = new BigNumber(1);
    const ethToConvert = ZeroEx.toBaseUnitAmount(ethAmount, DECIMALS); // Number of ETH to convert to WETH

    const convertEthTxHash = await zeroEx.etherToken.depositAsync(WETH_ADDRESS, ethToConvert, takerAddress);
    await zeroEx.awaitTransactionMinedAsync(convertEthTxHash);
    console.log(`${ethAmount} ETH -> WETH conversion mined...`);

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

    // Signing orderHash -> ecSignature
    const shouldAddPersonalMessagePrefix = false;
    const ecSignature = await zeroEx.signOrderHashAsync(orderHash, makerAddress, shouldAddPersonalMessagePrefix);

    // Appending signature to order
    const signedOrder = {
        ...order,
        ecSignature,
    };

};

const hello_world_async = async (arg1:string) => {
  console.log("hello world, " + arg1);
  return;
}



const fillAsync = async (signedOrder:any, takerAddress:any) => {

    // Verify that order is fillable
    await zeroEx.exchange.validateOrderFillableOrThrowAsync(signedOrder);

    // Try to fill order
    const shouldThrowOnInsufficientBalanceOrAllowance = true;
    const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);

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
}


// const testRpcAccounts = logAddressesAsync();
// console.log("RPC accts: ", testRpcAccounts);


// // Set maker and takers to the first 2 things in the testRPC accounts
//     const [makerAddress, takerAddress] = accounts;
