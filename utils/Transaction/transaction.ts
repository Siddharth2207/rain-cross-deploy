import {ethers} from "ethers"  
import { RainNetworks } from ".."
import contractConfig from "../../config/config.json"
/*
* Get transaction data (bytecode + args)
*/
export const getTransactionData = async ( 
  provider: any, 
  transactionHash:string
): Promise<string> => { 

    const transaction = await provider.getTransaction(transactionHash)  
    return transaction.data
}   
  

/**
 *Replace all DISpair instances 
 */
 export const getTransactionDataForNetwork =  (
    txData:string,
    fromNetwork:RainNetworks,
    toNetwork:RainNetworks
  ) => {
  
    txData = txData.toLocaleLowerCase()
    const fromNetworkConfig = contractConfig.contracts[fromNetwork]
    const toNetworkConfig = contractConfig.contracts[toNetwork]  
  
  
    if(txData.includes(fromNetworkConfig["interpreter"]["address"].split('x')[1].toLowerCase())){ 
      txData = txData.replace(fromNetworkConfig["interpreter"]["address"].split('x')[1].toLowerCase(), toNetworkConfig["interpreter"]["address"].split('x')[1].toLowerCase())
    }
    if(txData.includes(fromNetworkConfig["store"]["address"].split('x')[1].toLowerCase())){
      txData = txData.replace(fromNetworkConfig["store"]["address"].split('x')[1].toLowerCase(), toNetworkConfig["store"]["address"].split('x')[1].toLowerCase())
    }
    if(txData.includes(fromNetworkConfig["expressionDeployer"]["address"].split('x')[1].toLowerCase())){
      txData = txData.replace(fromNetworkConfig["expressionDeployer"]["address"].split('x')[1].toLowerCase(), toNetworkConfig["expressionDeployer"]["address"].split('x')[1].toLowerCase())
    }
    return txData 
      
} 