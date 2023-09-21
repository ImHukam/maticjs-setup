const { use, POSClient } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
const { providers, Wallet } = require("ethers");

const dotenv = require('dotenv');
const path = require('path');
const env = dotenv.config({
    path: path.join(__dirname, '.env')
});

use(Web3ClientPlugin);

const from = process.env.USER_FROM;
const privateKey = process.env.USER_PRIVATE_KEY;
const root_token = process.env.ROOT_TOKEN;
const root_rpc= process.env.ROOT_RPC;
const matic_rpc= process.env.MATIC_RPC

const execute = async () => {

    const parentPrivder = new providers.JsonRpcProvider(root_rpc);
    const childProvider = new providers.JsonRpcProvider(matic_rpc);

    const matic = new POSClient();
    await matic.init({
        // log: true,
        network: 'testnet',
        version: 'mumbai',
        parent: {
            provider: new Wallet(privateKey, parentPrivder),
            defaultConfig: {
                from
            }
        },
        child: {
            provider: new Wallet(privateKey, childProvider),
            defaultConfig: {
                from
            }
        }
    });

    const rootTokenErc20 = matic.erc20(root_token, true);

    const balanceRoot = await rootTokenErc20.getBalance(from)
    console.log('balanceRoot', balanceRoot);
}

execute().then(_ => {
    process.exit(0)
}).catch(err => {
    console.error("error", err);
    process.exit(0);
})
