export type PromiseOrValue<T> = T | Promise<T>;

/**
 * The definition of the DISpair instances.
 * This will work for regular contract or the expression deployer
 */
export type DISpair = {
  interpreter: PromiseOrValue<string>;
  store: PromiseOrValue<string>;
  deployer?: PromiseOrValue<string>;
};

export enum RainNetworks {
  Mumbai = "mumbai",
  Polygon = "polygon",
  Ethereum = "ethereum",
}

export type BlockScannerInfo = { url: string; apiKey: string };
