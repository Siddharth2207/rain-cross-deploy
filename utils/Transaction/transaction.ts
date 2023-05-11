import { ChainId, getContractAddressesForChainOrThrow } from "@0x/contract-addresses"
import {ethers} from "ethers"  
import { DISpair, getProviderForNetwork, getRegistryForNetwork,  RainNetworks } from ".."
import axios from 'axios' 


export const getTransactionDataForDeployer = async ( 
  fromNetwork: RainNetworks, 
  contractAddress:string
) => { 

    const registry = getRegistryForNetwork(fromNetwork) 

    const provider = getProviderForNetwork(fromNetwork) 

    const result = await axios.post(
      registry,
        { 
          query: `
          {
            expressionDeployers(where: {id: "${contractAddress.toLowerCase()}"}) {
              deployTransaction {
                id
              }
            }
          }
          `
        },
        { headers: { "Content-Type": "application/json" } }
    );  

    if(result){
      const transaction = await provider.getTransaction(result.data.data.expressionDeployers[0].deployTransaction.id)  
      return transaction.data
    } 

    return null

    
}   
  


/*
* Get transaction data (bytecode + args)
*/
export const getTransactionData = async ( 
  fromNetwork: RainNetworks, 
  contractAddress:string
) => { 

    const registry = getRegistryForNetwork(fromNetwork) 

    const provider = getProviderForNetwork(fromNetwork) 

    const result = await axios.post(
      registry,
        { 
          query: `
          {
            contracts(where: {id: "${contractAddress.toLowerCase()}"}) {
              deployTransaction {
                id
              }
            }
          }
          `
        },
        { headers: { "Content-Type": "application/json" } }
    );  

    if(result){
      const transaction = await provider.getTransaction(result.data.data.contracts[0].deployTransaction.id)  
      return transaction.data
    } 

    return null

    
}   
  

/**
 *Replace all DISpair instances 
 */
 export const getTransactionDataForNetwork =  (
    txData : string,
    fromNetworkDIS : DISpair ,
    toNetworkDIS : DISpair
  ) => {
  
    txData = txData.toLocaleLowerCase()
   
    if(txData.includes(fromNetworkDIS.interpreter.toString().split('x')[1]?.toLowerCase())){ 
      txData = txData.replace(fromNetworkDIS.interpreter.toString().split('x')[1]?.toLowerCase(), toNetworkDIS.interpreter.toString().split('x')[1]?.toLowerCase())
    }
    if(txData.includes(fromNetworkDIS.store.toString().split('x')[1]?.toLowerCase())){
      txData = txData.replace(fromNetworkDIS.store.toString().split('x')[1]?.toLowerCase(), toNetworkDIS.store.toString().split('x')[1]?.toLowerCase())
    }
    if(txData.includes(fromNetworkDIS.deployer.toString().split('x')[1]?.toLowerCase())){
      txData = txData.replace(fromNetworkDIS.deployer.toString().split('x')[1]?.toLowerCase(), toNetworkDIS.deployer.toString().split('x')[1]?.toLowerCase())
    }
    return txData 
      
}    


/**
 * @TODO : Include deploying 0x Arb contract
 * */

// export const getChainId = (network : RainNetworks) => { 
//   if(network == RainNetworks.Mumbai){
//     return ChainId.PolygonMumbai
//   }else if(network == RainNetworks.Polygon){
//     return ChainId.Polygon
//   }else if(network == RainNetworks.Ethereum){
//     return ChainId.Mainnet
//   }
// }

// export const getTransactionDataForZeroEx = (
//   txData:string,
//   fromNetwork:RainNetworks,
//   toNetwork:RainNetworks
// ) => { 

//   const { exchangeProxy: fromNetworkProxy } = getContractAddressesForChainOrThrow(getChainId(fromNetwork));
//   const { exchangeProxy: toNetworkProxy } = getContractAddressesForChainOrThrow(getChainId(toNetwork));  

  
//   txData = txData.toLocaleLowerCase()
//   const fromContractConfig = contractConfig.contracts[fromNetwork]
//   const toContractConfig = contractConfig.contracts[toNetwork] 

//   if(txData.includes(fromContractConfig["orderbook"]["address"].split('x')[1]?.toLowerCase())){ 
//     txData = txData.replace(fromContractConfig["orderbook"]["address"].split('x')[1]?.toLowerCase(), toContractConfig["orderbook"]["address"].split('x')[1]?.toLowerCase())
//   }
//   if(txData.includes(fromNetworkProxy.split('x')[1]?.toLowerCase())){
//     txData = txData.replace(fromNetworkProxy.split('x')[1]?.toLowerCase(), toNetworkProxy.split('x')[1]?.toLowerCase())
//   }
//   return txData 
// }  