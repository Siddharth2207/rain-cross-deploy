import {
  RainNetworks,
  DISpair,
  NetworkProvider,
  replaceDISpairInstanceTxData,
  getDeployTransactionHashFromAPI,
  getDeployTransactionHashFromSubgraph,
  getDeployTransactionHash,
  getTransactionFromTxHash,
} from "../../utils";

export const getDeployerDeployTxData = async (
  fromNetwork: RainNetworks,
  fromDIS: DISpair,
  toDIS: DISpair,
  contractAddress: string
): Promise<string | null> => {
  // Get transaction data for origin network
  const txDataOriginNetwork = await getDeployTransactionHashFromSubgraph(
    fromNetwork,
    contractAddress
  );

  if (!txDataOriginNetwork) return null;

  // Get transaction data for target network
  const txDataTargetNetwork = replaceDISpairInstanceTxData(
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
  const txDataOriginNetwork = await getDeployTransactionHashFromSubgraph(
    fromNetwork,
    contractAddress
  );

  if (!txDataOriginNetwork) return null;

  // Get transaction data for target network
  const txDataTargetNetwork = replaceDISpairInstanceTxData(
    txDataOriginNetwork,
    fromDIS,
    toDIS
  );

  return txDataTargetNetwork;
};

/**
 * Function that  try to be agnostic to the type of contract, and try to generate the
 * tx data from many sources, using and following the next priorities.
 * - Subgraphs
 * - Block scanner APIs
 *
 * @dev It is necessary to have in mind that in some cases this will not generate
 * any or unknown/wrong result when consuming the function and not having idea
 * what kind of contract is. Some scenearios and their possibles outputs:
 *
 * - It's a rain contract using DISpair instances on the supported chains, it will
 * generate the correct transaction data.
 * - It's a rain contract that is not using DISpair instances and it have not
 * a constructor, it will generate the correct transaction data (using provider),
 * - It's a rain contract that have a constructor that is not chain dependent, it
 * will generate the correct transaction data (since not modify the tx data)
 *
 * @param fromNetwork_
 * @param contractAddress_
 * @param DIS
 * @returns
 */
export const getDeployTxData = async (
  fromNetwork_: RainNetworks,
  contractAddress_: string,
  options_: {
    txHash?: string;
    DIS?: {
      from: DISpair;
      to: DISpair;
    };
  } = {}
) => {
  const { txHash: txHashOption, DIS } = options_;
  let txDataOriginNetwork: string | null = null;

  if (txHashOption) {
    // Use the tx hash provided and check if the contract address of the receipt
    // match with the address provided.

    const txResp = await getTransactionFromTxHash(txHashOption, fromNetwork_);
    if (!txResp) throw new Error("It cannot get transaction information");

    const txReceipt = await txResp.wait();
    if (
      txReceipt.contractAddress.toLowerCase() != contractAddress_.toLowerCase()
    ) {
      throw new Error(
        "The transaction hash provided does not match with the contract address"
      );
    }

    txDataOriginNetwork = txResp.data;
  }

  // If the `txHashOption` was not provided, the `txDataOriginNetwork` still null,
  // so means that the code need to check on the tooling.
  // Otherwise, if the `txHashOption` was provided, the `txDataOriginNetwork`
  // should be fileld or an error happened. But this will wokr as double check here.
  if (!txDataOriginNetwork) {
    // Search on the tooling
    const txHashTooling = await getDeployTransactionHash(
      fromNetwork_,
      contractAddress_
    );

    // If nothing found here, then means that the deploy transaction hash
    // need to be provided since the tooling cannot obtained it.
    if (!txHashTooling) return null;

    const txResp = await getTransactionFromTxHash(txHashTooling, fromNetwork_);

    // It cannot obtain the transaction, but could means that tx hash is wrong
    // or the `fromNetwork_` or the  `contractAddress_`. In that case is up to
    // the consumer, but the code should not error there.
    if (!txResp) return null;

    txDataOriginNetwork = txResp.data;
  }

  // It's a contract that have DISpair instances. This means that could be a
  // regular contract or an expression deployer with just interpreter and store
  // instances.
  if (DIS) {
    // Check if both deployer (from and to) are present OR if both are missing
    if (
      (DIS.from.deployer && DIS.to.deployer) ||
      (!DIS.from.deployer && !DIS.to.deployer)
    ) {
      // If in "from" and "to" the deployer is provided, then It's a regular contract
      // If in "from" and "to" the deployer is missing, then It's a deployer
      // Both cases should be handled here.
      const txDataTargetNetwork = replaceDISpairInstanceTxData(
        txDataOriginNetwork,
        DIS.from,
        DIS.to
      );

      return txDataTargetNetwork;
    } else {
      // A deloyer instances was provided on "from" or "to" without his counterpart.
      // It's not possible to determine if it's a deployer or not.
      // An data is missing or extra
      throw new Error(
        'A deloyer instances was provided on "from" or "to" DISpair instance without his counterpart'
      );
    }
  } else {
    // It is another type of contract, like Interpreter, Store, CloneFactory, or
    // Or other contract with no DIS intances. Also, possibly this could handle
    // the deployment of "non-rain contracts", but the code does not ensure the
    // success of that. Similarly, it is no guarantee that it can always do so,
    // since its arguments will be unknown in the tx hash.

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
