const { ZkEvmClient, use } = require('@maticnetwork/maticjs');
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-ethers');
const { providers,Wallet} = require("ethers");

require('dotenv').config();

use(Web3ClientPlugin);

async function main() {

    const parentPrivder = new providers.JsonRpcProvider(process.env.L1RPC);
    const childProvider = new providers.JsonRpcProvider(process.env.L2RPC);
    const privateKey = process.env.USER_PRIVATE_KEY;
    const from = process.env.USER_FROM;

    const zkEvmClient = new ZkEvmClient();
    await zkEvmClient.init({
        network: "testnet",
        version: "blueberry",
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
        },
        log: true
    });

    const txHash = "0xa3e1bcd4d06690d6e28f782c58c2e1864eab5d00b9a944a2630ec0a219552b95";
    const isDeposit = await zkEvmClient.isDeposited(txHash);
    console.log(isDeposit)

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
