import {ethers} from "ethers";
import { RainContracts, getTransactionData, getTransactionDataForNetwork, RainNetworks } from "../../utils";
import contractConfig from "../../config/config.json";


export const getContractDeployTxData = async ( 
    fromNetwork: RainNetworks,
    toNetwork: RainNetworks, 
    contract: RainContracts
) => {    

   
    const txHash = contractConfig.contracts[fromNetwork][contract].transaction 

    // Provider for origin network for out purposes this will be mumbai network 
    const mumbaiProvider = new ethers.providers.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com')

    // Get transaction data for origin network
    const txDataOriginNetwork = await getTransactionData(mumbaiProvider, txHash)  

    // Get transaction data for target network
    const txDataTargetNetwork = getTransactionDataForNetwork(txDataOriginNetwork, fromNetwork, toNetwork )   

    return txDataTargetNetwork

}