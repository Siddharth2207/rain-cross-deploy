import {ethers} from "ethers";
import { RainContracts, getTransactionData, getTransactionDataForNetwork, RainNetworks, getTransactionDataForZeroEx } from "../../utils"; 
import {  ChainId } from "@0x/contract-addresses";
import contractConfig from "../../config/config.json";


// Provider for origin network for out purposes this will be mumbai network 
const mumbaiProvider = new ethers.providers.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com') 

export const getContractDeployTxData = async ( 
    fromNetwork: RainNetworks,
    toNetwork: RainNetworks, 
    contract: RainContracts
) => {     

    const txHash = contractConfig.contracts[fromNetwork][contract].transaction 

    // Get transaction data for origin network
    const txDataOriginNetwork = await getTransactionData(mumbaiProvider, txHash)  

    // Get transaction data for target network
    const txDataTargetNetwork = getTransactionDataForNetwork(txDataOriginNetwork, fromNetwork, toNetwork )   

    return txDataTargetNetwork
} 

export const deployArbImplementation = async (
    fromNetwork: ChainId,
    toNetwork: ChainId, 
) => { 

    const txHash  = contractConfig.contracts[fromNetwork]["zeroexorderbookimplmentation"].transaction 

    // Get transaction data for origin network
    const txDataOriginNetwork = await getTransactionData(mumbaiProvider, txHash)   

    //replace proxy and ob instances
    const txDataTargetNetwork = getTransactionDataForZeroEx(txDataOriginNetwork,fromNetwork,toNetwork) 
    
    return txDataTargetNetwork


}