<img src="https://github.com/easyish/arcrelay/blob/master/arcrelay_logo.png" width="200px" >

# ArcRelay - simple 0x relayer

This is the beginning stages of a 0x relayer web application built on the Ethereum blockchain using the 0x protocol.

## Setup instructions

### Pre-prerequisites
#### Mac [1]
##### Install Xcode
Install Xcode if you don't have it already. You can find it in the [App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)

##### Install Homebrew
At the terminal run:

`
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
`

#### Linux [2]
##### Install Ruby and GCC
You'll need Ruby 1.8.6 or newer and GCC 4.2 or newer before you can install Node.js and NPM.

For Ubuntu or Debian-based Linux distributions, run the following command in your terminal:

`
$ sudo apt-get install build-essential curl git m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev
`

Then select Y to continue and wait for the packages to be installed.

For Fedora based Linux distributions run the following command in your terminal:

`
$ sudo yum groupinstall 'Development Tools' && sudo yum install curl git m4 ruby texinfo bzip2-devel curl-devel expat-devel ncurses-devel zlib-devel
`

Then select Y to continue and wait for the packages to be installed.

##### Install Homebrew
Run

`
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
`

Follow the instructions in the terminal to complete the installation process.
Once Linuxbrew is installed, you’ll need add the following 3 lines to your .bashrc or .zshrc file:

`
  export PATH="$HOME/.linuxbrew/bin:$PATH"
  export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"
  export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"
`

### Install node and npm (if you don't have them)
To see if node is installed type `node -v` in the terminal. To see if npm is installed type `npm -v`

If you do not have node and npm installed but you have done the above step, you can easily install them by opening terminal and running

`
$ brew install node
`

### 1. Clone or download this repo

### 2. Install typescript
This project is written primarily in typescript, so you will need to install that

`
$ npm install -s typescript
`

### 3. Install yarn and run it
Install yarn

`
$ brew install yarn --without -node
`

now cd into the main folder of the cloned or downloaded project and run:

`
$ yarn
`

Pull the latest TestRPC 0x snapshot with all the 0x contracts pre-deployed:

`
yarn download_snapshot
`

### 4. Start testRPC
open another terminal window (to leave open), cd into the project folder, and run:

`
$ yarn testrpc
`

this sets up an Ethereum testnet on the local machine

### 5. Start the frontend on a SimpleHTTPServer
run this in 'public' directory to host the `index.html` client:

`
python -m SimpleHTTPServer 8080
`


### 6. Run the backend server
To compile and run server.ts with all necessary dependencies,
leave testRPC running in the 2nd terminal window, and in the 1st terminal window run:

`
$ yarn dev
`

At this point you should be able to interact with the frontend in order to create orders on the testRPC blockchain

### tl;dr -- you need all three of these to work:
- run `python -m SimpleHTTPServer 8080` in 'public' directory to host client
- run `yarn dev` to host server
- run `yarn testrpc`


#### NOTE - If you accidentally close a part of the application with CTRL-Z instead of CTRL-C, you may need to kill the process using the port with:
`$ lsof -i :<PORT>`
`$ kill -9 <PID>`

### Explanation of order fields:
maker : Ethereum address of our Maker.<br/>
taker : Ethereum address of our Taker.<br/>
feeRecipient : Ethereum address of our Relayer (none for now).<br/>
makerTokenAddress: The token address the Maker is offering.<br/>
takerTokenAddress: The token address the Maker is requesting from the Taker.<br/>
exchangeContractAddress : The exchange.sol address.<br/>
salt: Random number to make the order (and therefore its hash) unique.<br/>
makerFee: How many ZRX the Maker will pay as a fee to the Relayer.<br/>
takerFee : How many ZRX the Taker will pay as a fee to the Relayer.<br/>
makerTokenAmount: The amount of token the Maker is offering.<br/>
takerTokenAmount: The amount of token the Maker is requesting from the Taker.<br/>
expirationUnixTimestampSec: When will the order expire (in unix time). [3]



[1] http://blog.teamtreehouse.com/install-node-js-npm-mac

[2] http://blog.teamtreehouse.com/install-node-js-npm-linux

[3] https://0xproject.com/wiki

Huge credits to the 0x team and 0x wiki
