import { DecodedLogEvent, ZeroEx } from '0x.js';
import { BigNumber } from '@0xproject/utils';
import * as Web3 from 'web3';

const TESTRPC_NETWORK_ID = 50;

//
//instantiate a zeroEx and a HttpProvider
//
// Provider pointing to local TestRPC on default port 8545
const provider = new Web3.providers.HttpProvider('http://localhost:8545');

// Instantiate 0x.js instance
const configs = {
    networkId: TESTRPC_NETWORK_ID,
};
const zeroEx = new ZeroEx(provider, configs);


const setupAddresses = async () => {
    // set contract and exchange addresses
    const WETH_ADDRESS = zeroEx.etherToken.getContractAddressIfExists() as string; // The wrapped ETH token contract
    const ZRX_ADDRESS = zeroEx.exchange.getZRXTokenAddress(); // The ZRX token contract
    // The Exchange.sol address (0x exchange smart contract)
    const EXCHANGE_ADDRESS = zeroEx.exchange.getContractAddress();
};

const setAllowances = async () => {
    //set allowances
    // Unlimited allowances to 0x proxy contract for maker and taker
    const setMakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(ZRX_ADDRESS, makerAddress);
    await zeroEx.awaitTransactionMinedAsync(setMakerAllowTxHash);

    const setTakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(WETH_ADDRESS, takerAddress);
    await zeroEx.awaitTransactionMinedAsync(setTakerAllowTxHash);
    console.log('Taker allowance mined...');
};

//Ethereum Virtual Machine doesn't use decimals so we need to set DECIMALS
//to convert our amounts with BigNumber()
// Number of decimals to use (for ETH and ZRX)
const DECIMALS = 18;


//hard code in accounts from testRPC:  (replace with user input addresses later )
// Getting list of accounts
const accounts = await zeroEx.getAvailableAddressesAsync();
console.log('accounts: ', accounts);

// Set maker and takers to the first 2 things in the testRPC accounts
const [makerAddress, takerAddress] = accounts;



const mainAsync = async () => {

    setupAddresses();
    setAllowances();

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
};

mainAsync().catch(console.error);
