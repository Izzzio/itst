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


const logger = new (require(global.PATH.mainDir + '/modules/logger'))("TEST");

/**
 * @type {{assert: module.exports.assert, lt: module.exports.lt, true: module.exports.true, false: module.exports.false, gt: module.exports.gt, defined: module.exports.defined}}
 */
const assert = require(global.PATH.mainDir + '/modules/testing/assert');


const DApp = require(global.PATH.mainDir + '/app/DApp');
const TokenContractConnector = require(global.PATH.mainDir + '/modules/smartContracts/connectors/TokenContractConnector');
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

        const factoryContractCode = fs.readFileSync('factoryContract.js').toString();
        const newBlock = await that.contracts.ecmaPromise.deployContract(factoryContractCode, 10);


        let perfomerId = 'perfId-1';
        let perfomerInfo = {name: 'perfomer Name', age: 10, status: 'active'};
        let customerId = 'custId-1';
        let customerInfo = {name: 'customer Name', age: 18, status: 'new'};
        let contractId = '1111112222233333444444';
        let infoFromOrderCONSTANT = '';
        let infoFromOrderEDIT = '';
        let infoFromOfferCONCTANT = '';
        let infoFromOfferEDIT = '';
        let newContract = {};


        newContract = JSON.parse(
            await that.contracts.ecmaPromise.callMethodRollback(
                newBlock.address,
                'newContractWithNewPerformer',
                [
                    perfomerId,
                    perfomerInfo,
                    customerId,
                    contractId,
                    infoFromOrderCONSTANT,
                    infoFromOrderEDIT,
                    infoFromOfferCONCTANT,
                    infoFromOfferEDIT
                ],
                {}
            )
        );
        assert.false(newContract.contractParams.contractCompleted, 'Error create new agreement contract with new performer');
        assert.assert(newContract.contractParams.perfomerInfo.length !== 0, 'Error create new agreement contract(with performer only): performer not exist');


        newContract = JSON.parse(
            await that.contracts.ecmaPromise.callMethodRollback(
                newBlock.address,
                'newContractWithNewCustomer',
                [
                    perfomerId,
                    customerId,
                    customerInfo,
                    contractId,
                    infoFromOrderCONSTANT,
                    infoFromOrderEDIT,
                    infoFromOfferCONCTANT,
                    infoFromOfferEDIT
                ],
                {}
            )
        );
        assert.false(newContract.contractParams.contractCompleted, 'Error create new agreement contract with new customer');
        assert.assert(newContract.contractParams.customerInfo.length !== 0, 'Error create new agreement contract(with customer only): customer not exist');


        newContract = JSON.parse(
            await that.contracts.ecmaPromise.callMethodRollback(
                newBlock.address,
                'newContractOnly',
                [
                    perfomerId,
                    customerId,
                    contractId,
                    infoFromOrderCONSTANT,
                    infoFromOrderEDIT,
                    infoFromOfferCONCTANT,
                    infoFromOfferEDIT
                ],
                {}
            )
        );
        assert.false(newContract.contractParams.contractCompleted, 'Error create new agreement contract(only contract)');


        await that.contracts.ecmaPromise.deployMethod(
            newBlock.address,
            'newContractWithNewCustomerAndPerformer',
            [
                perfomerId,
                perfomerInfo,
                customerId,
                customerInfo,
                contractId,
                infoFromOrderCONSTANT,
                infoFromOrderEDIT,
                infoFromOfferCONCTANT,
                infoFromOfferEDIT
            ],
            {}
        );
        let contractActive = JSON.parse(
            await that.contracts.ecmaPromise.callMethodRollback(
                newBlock.address,
                "getActiveContract",
                [
                    perfomerId,
                    customerId,
                    contractId,
                ],
                {}
            )
        );

        assert.false(contractActive.contractParams.contractCompleted, 'Agreement contract exist and active, but already completed and should be in completed group.');


        let newInfoFromOrderEDIT = {'new_info': 'order new info'};
        let contractChanged = JSON.parse(
            await that.contracts.ecmaPromise.callMethodRollback(
                newBlock.address,
                'changeInfoFromOrderEDIT',
                [
                    perfomerId,
                    customerId,
                    contractId,
                    newInfoFromOrderEDIT,
                ],
                {}
            )
        );
        assert.true(newInfoFromOrderEDIT.new_info === contractChanged.contractParams.infoFromOrderEDIT.new_info, 'Error update value for key infoFromOrderEDIT.');


        let newInfoFromOfferEDIT = {'new_info': 'offer new info'};
        contractChanged = JSON.parse(
            await that.contracts.ecmaPromise.callMethodRollback(
                newBlock.address,
                'changeInfoFromOfferEDIT',
                [
                    perfomerId,
                    customerId,
                    contractId,
                    newInfoFromOfferEDIT,
                ],
                {}
            )
        );
        assert.true(newInfoFromOfferEDIT.new_info === contractChanged.contractParams.infoFromOfferEDIT.new_info, 'Error update value for key infoFromOfferEDIT.');


        await that.contracts.ecmaPromise.deployMethod(
            newBlock.address,
            'completeTheContract',
            [
                perfomerId,
                customerId,
                contractId,
            ],
            {}
        );

        let contractCompleted = JSON.parse(
            await that.contracts.ecmaPromise.callMethodRollback(
                newBlock.address,
                "getCompletedContract",
                [
                    perfomerId,
                    customerId,
                    contractId,
                ],
                {}
            )
        );
        assert.true(contractCompleted.contractParams.contractCompleted, 'Error set contract completed');


        await that.contracts.ecmaPromise.deployMethod(
            newBlock.address,
            'removePerfomer',
            [
                perfomerId,
            ],
            {}
        );
        await that.contracts.ecmaPromise.deployMethod(
            newBlock.address,
            'removeCustomer',
            [
                customerId,
            ],
            {}
        );
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