import { ethers } from "ethers";
import {
  BlockScannerAPI,
  DISpair,
  NetworkProvider,
  RainNetworks,
  RegistrySubgraph,
} from "..";
import axios from "axios";

// import {
//   ChainId,
//   getContractAddressesForChainOrThrow,
// } from "@0x/contract-addresses";

/**
 * Allow to check if it is possible to obtain the deploy transaction using the
 * `getDeployTxData` present on the package. This is useful to inform and request
 * a transaction hash in the option as a input when calling `getDeployTxData`.
 */
export const checkObtainTxHash = async (
  fromNetwork_: RainNetworks,
  contractAddress_: string
): Promise<boolean> => {
  return (await getDeployTransactionHash(fromNetwork_, contractAddress_))
    ? true
    : false;
};

export const getDeployTransactionHash = async (
  fromNetwork_: RainNetworks,
  contractAddress_: string
): Promise<string | null> => {
  // Priority on the subgraph, since it is rain tooling and avoid to use
  // the API keys.
  let txHashOriginNetwork = await getDeployTransactionHashFromSubgraph(
    fromNetwork_,
    contractAddress_
  );

  // If the subgraph does not have info of the tx hash, then use the block
  // scanner API
  if (!txHashOriginNetwork) {
    txHashOriginNetwork = await getDeployTransactionHashFromAPI(
      fromNetwork_,
      contractAddress_
    );
  }

  return txHashOriginNetwork;
};

export const getTransactionFromTxHash = async (
  txHash_: string,
  fromNetwork_: RainNetworks
): Promise<ethers.providers.TransactionResponse | null> => {
  const provider = NetworkProvider.get(fromNetwork_);
  if (!provider)
    throw new Error(`No RPC Provider for this network: ${fromNetwork_}`);

  const transaction = await provider.getTransaction(txHash_);

  return transaction ?? null;
};

/*
 * Get transaction data (bytecode + args) using the Block scanner APIs.
 * Some block scanners, mainly of the testnets, does not support this
 */
export const getDeployTransactionHashFromAPI = async (
  fromNetwork: RainNetworks,
  contractAddress: string
): Promise<string | null> => {
  const url = BlockScannerAPI.getCreationHashURL(fromNetwork, contractAddress);
  const resultApi = await axios.get(url);

  if (resultApi.status == 200 && resultApi.data.status == "1") {
    return resultApi.data.result[0].txHash;
  }

  return null;
};

export const getDeployTransactionHashFromSubgraph = async (
  fromNetwork: RainNetworks,
  contractAddress: string
): Promise<string | null> => {
  const registry = RegistrySubgraph.get(fromNetwork);

  if (!registry)
    throw new Error(`No Registry Subgraph for this network: ${fromNetwork}`);

  const query = `{
    contract(id: "${contractAddress.toLowerCase()}") {
      deployTransaction {
        id
      }
    }
    expressionDeployer(id: "${contractAddress.toLowerCase()}") {
      deployTransaction {
        id
      }
    }
  }`;

  const { status, data } = await axios.post(
    registry,
    {
      query,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  // If response status is code 200, the response was obtained correctly.
  // But anyway this do not guarantee that the response will have a data.
  // So, the code should check which response have the data
  if (status == 200) {
    const {
      data: { contract, expressionDeployer },
    } = data;

    if (contract && contract.deployTransaction?.id)
      return contract.deployTransaction?.id;

    if (expressionDeployer && expressionDeployer.deployTransaction?.id)
      return expressionDeployer.deployTransaction?.id;
  }

  return null;
};

/**
 * Replace all DISpair instances `from` with `to` intances
 */
export const replaceDISpairInstanceTxData = (
  txData: string,
  fromNetworkDIS: DISpair,
  toNetworkDIS: DISpair
) => {
  txData = txData.toLocaleLowerCase();

  if (
    txData.includes(
      fromNetworkDIS.interpreter.toString().split("x")[1]?.toLowerCase()
    )
  ) {
    txData = txData.replace(
      fromNetworkDIS.interpreter.toString().split("x")[1]?.toLowerCase(),
      toNetworkDIS.interpreter.toString().split("x")[1]?.toLowerCase()
    );
  }
  if (
    txData.includes(
      fromNetworkDIS.store.toString().split("x")[1]?.toLowerCase()
    )
  ) {
    txData = txData.replace(
      fromNetworkDIS.store.toString().split("x")[1]?.toLowerCase(),
      toNetworkDIS.store.toString().split("x")[1]?.toLowerCase()
    );
  }
  if (
    fromNetworkDIS.deployer &&
    toNetworkDIS.deployer &&
    txData.includes(
      fromNetworkDIS.deployer.toString().split("x")[1]?.toLowerCase()
    )
  ) {
    txData = txData.replace(
      fromNetworkDIS.deployer.toString().split("x")[1]?.toLowerCase(),
      toNetworkDIS.deployer.toString().split("x")[1]?.toLowerCase()
    );
  }
  return txData;
};

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
