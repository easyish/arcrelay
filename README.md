<img src="https://github.com/easyish/arcrelay/blob/master/arcrelay_logo.png" width="200px" >

# ArcRelay - simple 0x relayer

This is the beginning stages of a 0x relayer web application built on the Ethereum blockchain using the 0x protocol.

## Setup instructions

### -1. Pre-prerequisites
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
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)" Follow the instructions in the terminal to complete the installation process.
Once Linuxbrew is installed, you’ll need add the following 3 lines to your .bashrc or .zshrc file:
`
  export PATH="$HOME/.linuxbrew/bin:$PATH"
  export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"
  export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"
`

### 0. Install node and npm (if you don't have them)
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
now cd into the main folder of the cloned or downloaded project and run
`
$ yarn
`
### 4. Start testRPC
open another terminal window (to leave open), cd into the project folder, and run:
`
$ yarn testrpc
`
Back in the first terminal window, run
`
$ yarn dev
`




[1] http://blog.teamtreehouse.com/install-node-js-npm-mac
[2] http://blog.teamtreehouse.com/install-node-js-npm-linux
