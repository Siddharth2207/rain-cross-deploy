import {
  RainNetworks,
  DISpair,
  NetworkProvider,
  getTransactionDataForDeployer_SG,
  getTransactionDataForNetwork,
  getTransactionData_SG,
  getTransactionData,
} from "../../utils";

export const getDeployerDeployTxData = async (
  fromNetwork: RainNetworks,
  fromDIS: DISpair,
  toDIS: DISpair,
  contractAddress: string
): Promise<string | null> => {
  // Get transaction data for origin network
  const txDataOriginNetwork = await getTransactionDataForDeployer_SG(
    fromNetwork,
    contractAddress
  );

  if (!txDataOriginNetwork) return null;

  // Get transaction data for target network
  const txDataTargetNetwork = getTransactionDataForNetwork(
    txDataOriginNetwork,
    fromDIS,
    toDIS
  );

  return txDataTargetNetwork;
};

export const getContractDeployTxData = async (
  fromNetwork: RainNetworks,
  fromDIS: DISpair,
  toDIS: DISpair,
  contractAddress: string
): Promise<string | null> => {
  // Get transaction data for origin network
  const txDataOriginNetwork = await getTransactionData_SG(
    fromNetwork,
    contractAddress
  );

  if (!txDataOriginNetwork) return null;

  // Get transaction data for target network
  const txDataTargetNetwork = getTransactionDataForNetwork(
    txDataOriginNetwork,
    fromDIS,
    toDIS
  );

  return txDataTargetNetwork;
};

export const getDeployTxData = async (
  fromNetwork: RainNetworks,
  contractAddress: string,
  DIS?: {
    from: DISpair;
    to: DISpair;
  }
) => {
  // Get transaction data for origin network
  const txDataOriginNetwork = await getTransactionData(
    fromNetwork,
    contractAddress
  );

  // Transaction data was not possible to found
  if (!txDataOriginNetwork) return null;

  // It's a contract that have DISpair instances. This means that could be a
  // regular contract or an expression deployer with just interpreter and store
  // instances.
  if (DIS) {
    if (
      (DIS.from.deployer && DIS.to.deployer) ||
      (!DIS.from.deployer && !DIS.to.deployer)
    ) {
      // If in "from" and "to" the deployer is provided, then It's a regular contract
      // If in "from" and "to" the deployer is missing, then It's a deployer
      // Both cases could be handled here.
      const txDataTargetNetwork = getTransactionDataForNetwork(
        txDataOriginNetwork,
        DIS.from,
        DIS.to
      );

      return txDataTargetNetwork;
    } else {
      // A deloyer instances was provided on "from" or "to" without his counterpart.
      // It's not possible to determine if it's a deployer or not.
      throw new Error(
        'A deloyer instances was provided on "from" or "to" DISpair instance without his counterpart'
      );
    }
  } else {
    // It is another type of contract, like Interpreter, Store, CloneFactory, or
    // Or other contract with no DIS intances. Also, possibly this could handle
    // the deployment of "non-rain contracts". Similarly, it is no guarantee that
    // it can always do so, since its arguments will be unknown in the tx hash.

    // Since some DISpair instance will no be change, return the same  origin
    // transaction data wihtout changes
    return txDataOriginNetwork;
  }
};

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
