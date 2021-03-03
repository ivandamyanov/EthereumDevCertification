### Ethereum development using solidity and web3 + react
Welcome to my repository of projects from the "Ethereum and Solidity: The Complete Developer's Guide" course at Udemy.
I control my progress here and I update the out-dated materials as much as I can to newer standards.

### `Inbox` project

Inbox is a very basic smart contract that we can use to understand how some features of solidity work, can be tested in remix and also how to write a compile script for a smart contract which outputs bytecode and ABI (contract interface).

### `Lottery` and `Lottery-react`

A smart contract in Solidity 0.8.0 and a front-end written in reactjs. The contract stores ethereum for 'players' who join with a minimum amount into the lottery.
The lottery goes on until the manager (the person who deploys the contract) decides to pick a winner pseudo-randomly. I've tested it with the latest Metamask version on the Rinkeby testnet. This is one of the faucets I used to obtain ETH for testing: https://app.mycrypto.com/faucet

### `Kickstart` project

Kickstart is a port of Kickstarter but running on Ethereum. Some people can create campaigns thru our CampaignFactory contract and then they can create requests to move the collected funds to a chosen address. This can only happen once more than 50% of the contributors have approved that request.

Note: What I've modified from the original guide is in no way perfect as I am not an expert in Solidity yet. Take it with a grain of salt.
