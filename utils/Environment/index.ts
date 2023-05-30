import { ethers } from "ethers";
import { BlockScannerInfo, RainNetworks } from "../Types";

export class RegistrySubgraph {
  static Ethereum(): string {
    return "https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry-ethereum";
  }
  static Polygon(): string {
    return "https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry-polygon";
  }
  static Mumbai(): string {
    return "https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry";
  }

  /**
   * Get the Registry subgraph URL endpoint from given a network.
   * @param network_ Network to retrieve the SG URL
   * @returns A string containing the Subgraph endpoint URL
   */
  static get(network_: RainNetworks): string | null {
    if (network_ === RainNetworks.Ethereum) {
      return this.Ethereum();
    } else if (network_ === RainNetworks.Polygon) {
      return this.Polygon();
    } else if (network_ === RainNetworks.Mumbai) {
      return this.Mumbai();
    }

    return null;
  }
}

export class NetworkProvider {
  static Ethereum(): ethers.providers.JsonRpcProvider {
    return new ethers.providers.JsonRpcProvider(
      "https://eth-mainnet.g.alchemy.com/v2/gqp-i6HKrlY8gShHDXkJw-iqudcviIyx"
    );
  }
  static Polygon(): ethers.providers.JsonRpcProvider {
    return new ethers.providers.JsonRpcProvider(
      "https://polygon-mainnet.g.alchemy.com/v2/WLWVvo6m4MXAZ3GkzmMI8ZnLIg_bBNaO"
    );
  }
  static Mumbai(): ethers.providers.JsonRpcProvider {
    return new ethers.providers.JsonRpcProvider(
      "https://matic-mumbai.chainstacklabs.com"
    );
  }

  /**
   * Get the RPC Provider from given a network.
   * @param network_ Network to retrieve the RPC provider
   * @returns A JsonRpcProvider
   */
  static get(network_: RainNetworks): ethers.providers.JsonRpcProvider | null {
    if (network_ === RainNetworks.Ethereum) {
      return this.Ethereum();
    } else if (network_ === RainNetworks.Polygon) {
      return this.Polygon();
    } else if (network_ === RainNetworks.Mumbai) {
      return this.Mumbai();
    }

    return null;
  }
}

export class BlockScannerAPI {
  static Ethereum(): BlockScannerInfo {
    return {
      url: "https://api.etherscan.io/",
      apiKey: "2JHMSJCUGUJ86RAKM1EPD15JJ3VAY76464",
    };
  }
  static Polygon(): BlockScannerInfo {
    return {
      url: "https://api.polygonscan.com/",
      apiKey: "MBFVU16WSKFB9Z5W17HC2DNTY3N6W9SMPX",
    };
  }
  static Mumbai(): BlockScannerInfo {
    return {
      url: "https://api-testnet.polygonscan.com/",
      apiKey: "MBFVU16WSKFB9Z5W17HC2DNTY3N6W9SMPX",
    };
  }

  /**
   * Obtain the API Block scanner information from this network_
   * @param network_ The network to obtain the API information
   * @returns The BlockScanner information
   */
  static get(network_: RainNetworks): BlockScannerInfo | null {
    if (network_ === RainNetworks.Ethereum) {
      return this.Ethereum();
    } else if (network_ === RainNetworks.Polygon) {
      return this.Polygon();
    } else if (network_ === RainNetworks.Mumbai) {
      return this.Mumbai();
    }

    return null;
  }

  static getCreationHashURL(network_: RainNetworks, address_: string): string {
    const scannerInfo = this.get(network_);

    if (!scannerInfo)
      throw new Error(
        `No Block Scanner information for this network: ${network_}`
      );

    const url = `${scannerInfo.url}/api?module=contract&action=getcontractcreation&contractaddresses=${address_}&apikey=${scannerInfo.apiKey}`;

    return url;
  }
}

export const getRainNetworkForChainId = (
  chainId: number
): RainNetworks | null => {
  if (chainId === 1) {
    return RainNetworks.Ethereum;
  } else if (chainId === 137) {
    return RainNetworks.Polygon;
  } else if (chainId === 80001) {
    return RainNetworks.Mumbai;
  }
  return null;
};
