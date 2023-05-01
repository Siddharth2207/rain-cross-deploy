import {ethers} from "ethers" 
import { getContractDeployTxData } from "./src"
import { RainContracts, RainNetworks } from "./utils"

async function test(){
    // let provider = new ethers.providers.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com') 
    
    // let tx = await provider.getTransaction('0x702ce153f22a99de43db72eebbbb96b52ed07fa81235b6f703c02c4bd0c5e46e') 

    // console.log(tx) 
    let data = await getContractDeployTxData(
        RainNetworks.Mumbai,
        RainNetworks.Mumbai,
        RainContracts.OrderBook
    ) 

    console.log("data : " , data)
} 

test()