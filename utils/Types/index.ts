export type PromiseOrValue<T> = T | Promise<T>;

export type DISpair = {
    interpreter : PromiseOrValue<string>;
    store : PromiseOrValue<string>;
    deployer : PromiseOrValue<string>;
}  


export enum RainContracts{ 
    Rainterpreter = 'interpreter',
    RainterpreterStore = 'store',
    RainterpreterExpressionDeployer = 'expressionDeployer',
    OrderBook = 'orderbook' ,
    ZeroEx = 'zeroexorderbookimplmentation'
}  

export enum RainNetworks{
    Mumbai = 'mumbai' ,
    Polygon = 'polygon',
    Ethereum = 'ethereum'
} 




