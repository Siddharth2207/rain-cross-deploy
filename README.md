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
import {getContractDeployTxData, DISpair, RainNetworks } from "rain-x-deploy"
```

### Get Transaction Data for Contract Deployment
You can then encode this data inside a transaction object and submit the transaction .
If you intend to use it with frontend library like `React` or `Svelte` . 
```sh
import {getContractDeployTxData, DISpair, RainNetworks } from "rain-x-deploy"  
import { ethers } from "ethers"; 

const deployContract = async () => {
    if(!window.ethereum) alert("Provider not injected")  
    
    //Initialize provider
    const provider = new ethers.providers.Web3Provider(window.ethereum) 
    
    // Get the signer
    const signer = await provider.getSigner()  
    
    // DISpair contracts of the originating network
    const fromDIS: DISpair = {
      interpreter:'0x24035b15e908551a2e1b4f435384d9485766d296',
      store:'0xd28543743f017045c9448ec6d82f5568a0f26918',
      deployer:'0x32ba42606ca2a2b91f28ebb0472a683b346e7cc7'
     }  
     
     // DISpair contracts of the target network
     const toDIS: DISpair = {
        interpreter : '0xeBEA638926F7BA49c0a1808e0Ff3B6d78789b153' ,
        store : '0xB92fd23b5a9CBE5047257a0300d161D449296C03' , 
        deployer : '0x34a81e8bc3e2420efc8ae84d35045c0326b00bdc'
     } 
     // Get contract deployment tx data for target network
     const txData = await getContractDeployTxData(
        RainNetworks.Mumbai, // originating network
        fromDIS, // DISpair originating network
        toDIS, // DISpair target network
        "0xacf6069f4a6a9c66db8b9a087592278bbccde5c3" //Origin contract address to x-deploy
      )
    
    // Submit the transaction
    await signer.sendTransaction({
      data :txData
    })
}
``` 
In case the originating and target networks are same(meaning you are simply trying to clone a contract on the network) you can pass the same DISpair as `fromDIS` and `toDIS`. 

Eg : 
```sh
const DISpair = {
    interpreter : '0xeBEA638926F7BA49c0a1808e0Ff3B6d78789b153' ,
    store : '0xB92fd23b5a9CBE5047257a0300d161D449296C03' , 
    deployer : '0x34a81e8bc3e2420efc8ae84d35045c0326b00bdc'
} 

// Pass the same DIS as origin and target to clone the contract.
 const txData = await getContractDeployTxData(
    RainNetworks.Ethereum, // originating network
    DISpair, 
    DISpair, 
    "0xce0a4f3e60178668c89f86d918a0585ca80e0f6d" //Origin contract address to x-deploy
  )
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



