## **Rain Cross Network Deploy**
Utility to deploy Rain Protocol Contracts to EVM based Networks. 
The dependency provides you with a way to get the `transaction data` for contract deployment of a particular `Rain Contract` which you can submit via a signer .

## Installation

```sh
npm install rain-x-deploy
```

## Usage
**import**
import (ESM, TypeScript):
```sh
import {getContractDeployTxData, RainContracts, RainNetworks } from "rain-x-deploy"
```

### Get Transaction Data for Contract Deployment
You can then encode this data inside a transaction object and submit the transaction .

```sh
import { BigNumber, ethers } from "ethers"; 
import {  Common,  CustomChain, Chain, Hardfork } from '@ethereumjs/common'
import {  FeeMarketEIP1559Transaction } from '@ethereumjs/tx'   
import {getContractDeployTxData, RainContracts, RainNetworks } from "rain-x-deploy"

// Get the transaction data for the contract deploy transaction. 
const transactionData = await getContractDeployTxData(
      RainNetworks.Mumbai, // Originating Network
      RainNetworks.Mumbai, // Target Network
      RainContracts.OrderBook // Contract to deploy
    )

// Build the transaction object
const txData = { 
      nonce: ethers.BigNumber.from(nonce).toHexString() ,
      data : transactionData ,
      type: '0x02'
   }   
        
// Generate Transaction 
const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common })   
const priKey = '0x1234....'
const privateKey = Buffer.from(
  priKey,
  'hex'
)
    
// Sign Transaction 
const signedTx = tx.sign(privateKey)

// Send the transaction
const contractDeployTransaction = await provider.sendTransaction(
  "0x" + signedTx.serialize().toString("hex")
); 
```
If you intend to use it with frontend library like `React` or `Svelte` . 
```sh
import {getContractDeployTxData, RainContracts, RainNetworks } from "rain-x-deploy"  
import { ethers } from "ethers"; 

const deployContract = async () => {
    if(!window.ethereum) alert("Provider not injected")  
    
    //Initialize provider
    const provider = new ethers.providers.Web3Provider(window.ethereum) 
    
    // Get the signer
    const signer = await provider.getSigner()  
    
    // Get Contract Deploy Transaction Data
    const txData = await getContractDeployTxData(
      RainNetworks.Mumbai,
      RainNetworks.Polygon,
      RainContracts.OrderBook
    ) 
    
    // Submit the transaction
    await signer.sendTransaction({
      data :txData
    })
}
``` 

####  Supported Contracts : 
You can deploy any of the following contracts by importing `RainContracts` enum from the package.
```
export enum RainContracts{ 
    Rainterpreter = 'interpreter',
    RainterpreterStore = 'store',
    RainterpreterExpressionDeployer = 'expressionDeployer',
    OrderBook = 'orderbook'
}   
```  

#### Supported Networks 
You can deploy contracts to any of the following networks by importing `RainNetworks` enum.
```
export enum RainNetworks{
    Mumbai = 'mumbai' ,
    Polygon = 'polygon',
    Ethereum = 'ethereum'
} 
```



