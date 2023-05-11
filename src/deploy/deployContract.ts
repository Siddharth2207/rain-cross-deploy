
import {  RainNetworks, DISpair, getProviderForNetwork } from "../../utils"; 



export const getInterpreterDeployTxData = async(
    fromNetwork: RainNetworks,
    contractAddress : string
) => { 

    const provider = getProviderForNetwork(fromNetwork)  
    const txData = await provider.getCode(contractAddress)  
    return txData 

} 

// export const getStoreDeployTxData = async(
//     fromNetwork: RainNetworks,
//     contractAddress : string
// ) => { 

//     const provider = getProviderForNetwork(fromNetwork)  
//     const txData = await provider.getCode(contractAddress)  
//     return txData 

// } 

// export const getDeployerDeployTxData = async(
//     fromNetwork: RainNetworks,
//     fromDIS : DISpair,
//     toDIS : DISpair,
//     contractAddress : string
// ) => { 

//     // Get transaction data for origin network
//     const txDataOriginNetwork = await getTransactionDataForDeployer(fromNetwork, contractAddress)   

//     // Get transaction data for target network
//     const txDataTargetNetwork = getTransactionDataForNetwork(txDataOriginNetwork, fromDIS, toDIS )   

//     return txDataTargetNetwork

// }



// export const getContractDeployTxData = async ( 
//     fromNetwork: RainNetworks,
//     fromDIS : DISpair,
//     toDIS : DISpair,
//     contractAddress : string
// ) => {     

//     // Get transaction data for origin network
//     const txDataOriginNetwork = await getTransactionData(fromNetwork, contractAddress)   

//     // Get transaction data for target network
//     const txDataTargetNetwork = getTransactionDataForNetwork(txDataOriginNetwork, fromDIS, toDIS )    

//     return txDataTargetNetwork
// } 

/**
 * @TODO : Include deploying 0x Arb contract
 * export const deployArbImplementation = async (
    fromNetwork: RainNetworks,
    toNetwork: RainNetworks, 
   ) => { 
    
    const txHash  = contractConfig.contracts[fromNetwork][RainContracts.ZeroEx].transaction 

    // Get transaction data for origin network
    const txDataOriginNetwork = await getTransactionData(mumbaiProvider, txHash)   

    //replace proxy and ob instances
    const txDataTargetNetwork = getTransactionDataForZeroEx(txDataOriginNetwork,fromNetwork,toNetwork) 
    
    return txDataTargetNetwork

     } 
 * 
 * 
 * */
