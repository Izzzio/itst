/**
 iZ³ | Izzzio blockchain - https://izzz.io

 Copyright 2018 Izio Ltd (OOO "Изио")

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */


const logger = new (require('../modules/logger'))("TEST");

/**
 * @type {{assert: module.exports.assert, lt: module.exports.lt, true: module.exports.true, false: module.exports.false, gt: module.exports.gt, defined: module.exports.defined}}
 */
const assert = require('../modules/testing/assert');

const storj = require('../modules/instanceStorage');
const Wallet = require('../modules/wallet');

const DApp = require('../app/DApp');
const TokenContractConnector = require('../modules/smartContracts/connectors/TokenContractConnector');
const fs = require('fs');


let that;

const mainTokenContract = fs.readFileSync('mainContract.js').toString();


/**
 * EDU DApp
 */
class App extends DApp {


    /**
     * Initialize
     */
    init() {
        that = this;

        process.on('SIGINT', () => {
            console.log('Terminating tests...');
            process.exit();
        });

        process.on('unhandledRejection', error => {
            logger.fatal(error);
            process.exit();
        });

        //Preparing environment
        logger.info('Deploying contract...');
        that.contracts.ecmaContract.deployContract(mainTokenContract, 0, function (deployedContract) {
            assert.true(deployedContract.address === that.getMasterContractAddress(), 'Invalid master contract address');
            that.run();
        });


    }


    /**
     * Factory contract test
     * @return {Promise<void>}
     */
    async factoryContractTest() {
        let mainToken = new TokenContractConnector(that.ecmaContract, that.getMasterContractAddress());
        const factoryContractCode = fs.readFileSync('factoryContract.js').toString();
        const newBlock = await that.contracts.ecmaPromise.deployContract(factoryContractCode, 0);

        let lastBalance = Number(await mainToken.balanceOf(this.getCurrentWallet().id));

        let result = JSON.parse(await that.contracts.ecmaPromise.callMethodRollback(newBlock.address, 'getActiveContract', [1, 1, 1], {}));


        console.log(result);


        assert.true(result.results.first === 0 && result.results.second === 0 && result.results.third === 0, 'Invalid empty vote results');
        assert.true(result.state === 'waiting', 'Invalid empty vote state');

        result = await that.contracts.ecmaPromise.deployMethod(newBlock.address, "startVoting", [], {});

        result = JSON.parse(await that.contracts.ecmaPromise.callMethodRollback(newBlock.address, 'getResultsOfVoting', [], {}));
        assert.true(result.state === 'started', 'Invalid empty vote state');

        await mainToken.pay(newBlock.address, "processPayment", '1', ['1']);

        assert.true(lastBalance === Number(await mainToken.balanceOf(this.getCurrentWallet().id)), "Invalid balance change");


        result = JSON.parse(await that.contracts.ecmaPromise.callMethodRollback(newBlock.address, 'getResultsOfVoting', [], {}));
        assert.true(result.results.first === 0 && result.results.second === 1 && result.results.third === 0, 'Invalid empty vote results');
        assert.true(result.state === 'ended', 'Invalid empty vote state');

    }


    /**
     * Run tests
     * @return {Promise<void>}
     */
    async run() {
        await this.factoryContractTest();

        console.log('');
        console.log('');
        console.log('');
        logger.info('Tests passed');
        process.exit();
    }

}

module.exports = App;