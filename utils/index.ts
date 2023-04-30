export enum RainContracts{ 
    
    Rainterpreter = 'interpreter',
    RainterpreterStore = 'store',
    RainterpreterExpressionDeployer = 'expressionDeployer',
    OrderBook = 'orderbook'
}  

export enum RainNetworks{
    Mumbai = 'mumbai',
    Polygon = 'polygon',
    Ethereum = 'ethereum'
}

export * from "./Transaction/transaction";