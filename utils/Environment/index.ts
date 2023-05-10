import { ethers } from "ethers";
import { RainNetworks } from "../Types";


export const mumbaiRegistry = "https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry" 
export const polygonRegistry = "https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry-polygon"   
export const ethereumRegistry = "https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry-ethereum" 

 
const mumbaiProvider = new ethers.providers.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com') 
const polygonProvider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/WLWVvo6m4MXAZ3GkzmMI8ZnLIg_bBNaO') 
const ethereumProvider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/gqp-i6HKrlY8gShHDXkJw-iqudcviIyx') 


export const getRegistryForNetwork = (
    network : RainNetworks
): string => {
    let registry = ''
    if(network === RainNetworks.Mumbai){
        registry = mumbaiRegistry
    }else if(network === RainNetworks.Polygon){
        registry = polygonRegistry
    }else if(network === RainNetworks.Ethereum){
        registry = ethereumRegistry
    }
    return registry
} 

export const getProviderForNetwork = (
    network : RainNetworks
) => {
    let provider  
    if(network === RainNetworks.Mumbai){
        provider = mumbaiProvider
    }else if(network === RainNetworks.Polygon){
        provider = polygonProvider
    }else if(network === RainNetworks.Ethereum){
        provider = ethereumProvider
    }
    return provider
} 
