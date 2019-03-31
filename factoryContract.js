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


/**
 * Factory contract
 */
class factoryContract extends Contract {

    constructor() {
        super();
        this._perfomerList = new BlockchainMap('_perfomerList');
        this._customerList = new BlockchainMap('_customerList');
        this._activeContracts = new BlockchainMap('_activeContracts');
        this._completedContracts = new BlockchainMap('_completedContracts');
    }


    static _createContractKey(perfomerId, customerId, contractId) {
        return perfomerId + '_' + customerId + '_' + contractId;
    }


    getActiveContract(perfomerId, customerId, contractId) {
        let contractKey = this._createContractKey(perfomerId, customerId, contractId);
        assert.true(this._activeContracts[contractKey], "Contract with this parameters doesn't exist or already completed");

        return this._activeContracts[contractKey];
    }


    getCompletedContract(perfomerId, customerId, contractId) {
        let contractKey = this._createContractKey(perfomerId, customerId, contractId);
        assert.true(this._completedContracts[contractKey], "Contract with this parameters doesn't exist or isn't yet complete");

        return this._completedContracts[contractKey];
    }


    _addPerfomer(perfomerId, perfomerInfo) {
        this._perfomerList[perfomerId] = {
            perfomerInfo: perfomerInfo,
        };
    }


    removePerfomer(perfomerId) {
        this._perfomerList[perfomerId] = undefined;
    }


    _addCustomer(customerId, customerInfo) {
        this._customerList[customerId] = {
            customerInfo: customerInfo,
        };
    }


    removeCustomer(customerId) {
        this._customerList[customerId] = undefined;
    }


    newContractWithNewCustomerAndPerformer(
        perfomerId,
        perfomerInfo,
        customerId,
        customerInfo,
        contractId,
        infoFromOrderCONSTANT,
        infoFromOrderEDIT,
        infoFromOfferCONCTANT,
        infoFromOfferEDIT
    ) {
        let contractKey = this._createContractKey(perfomerId, customerId, contractId);
        if (this._activeContracts[contractKey] || this._completedContracts[contractKey]) {
            assert.true(false, "Contract with such parameters(perfomerId, customerId, contractId) is already exist");
        }

        this._addPerfomer(perfomerId, perfomerInfo);
        this._addCustomer(customerId, customerInfo);

        let newAgreement = agreementContract.create(
            this._perfomerList[perfomerId],
            this._customerList[customerId],
            infoFromOrderCONSTANT,
            infoFromOrderEDIT,
            infoFromOfferCONCTANT,
            infoFromOfferEDIT
        );
        this._activeContracts[contractKey] = newAgreement;

        return newAgreement;
    }


    newContractWithNewPerformer(
        perfomerId,
        perfomerInfo,
        customerId,
        contractId,
        infoFromOrderCONSTANT,
        infoFromOrderEDIT,
        infoFromOfferCONCTANT,
        infoFromOfferEDIT
    ) {
        let contractKey = this._createContractKey(perfomerId, customerId, contractId);
        if (this._activeContracts[contractKey] || this._completedContracts[contractKey]) {
            assert.true(false, "Contract with such parameters(perfomerId, customerId, contractId) is already exist");
        }

        this._addPerfomer(perfomerId, perfomerInfo);

        let newAgreement = agreementContract.create(
            this._perfomerList[perfomerId],
            this._customerList[customerId],
            infoFromOrderCONSTANT,
            infoFromOrderEDIT,
            infoFromOfferCONCTANT,
            infoFromOfferEDIT
        );
        this._activeContracts[contractKey] = newAgreement;

        return newAgreement;
    }


    newContractWithNewCustomer(
        perfomerId,
        customerId,
        customerInfo,
        contractId,
        infoFromOrderCONSTANT,
        infoFromOrderEDIT,
        infoFromOfferCONCTANT,
        infoFromOfferEDIT
    ) {
        let contractKey = this._createContractKey(perfomerId, customerId, contractId);
        if (this._activeContracts[contractKey] || this._completedContracts[contractKey]) {
            assert.true(false, "Contract with such parameters(perfomerId, customerId, contractId) is already exist");
        }

        this._addCustomer(customerId, customerInfo);

        let newAgreement = agreementContract.create(
            this._perfomerList[perfomerId],
            this._customerList[customerId],
            infoFromOrderCONSTANT,
            infoFromOrderEDIT,
            infoFromOfferCONCTANT,
            infoFromOfferEDIT
        );
        this._activeContracts[contractKey] = newAgreement;

        return newAgreement;
    }


    newContractOnly(
        perfomerId,
        customerId,
        contractId,
        infoFromOrderCONSTANT,
        infoFromOrderEDIT,
        infoFromOfferCONCTANT,
        infoFromOfferEDIT
    ) {
        let contractKey = this._createContractKey(perfomerId, customerId, contractId);
        if (this._activeContracts[contractKey] || this._completedContracts[contractKey]) {
            assert.true(false, "Contract with such parameters(perfomerId, customerId, contractId) is already exist");
        }

        let newAgreement = agreementContract.create(
            this._perfomerList[perfomerId],
            this._customerList[customerId],
            infoFromOrderCONSTANT,
            infoFromOrderEDIT,
            infoFromOfferCONCTANT,
            infoFromOfferEDIT
        );
        this._activeContracts[contractKey] = newAgreement;

        return newAgreement;
    }


    changeInfoFromOrderEDIT(perfomerId, customerId, contractId, newInfoFromOrderEDIT) {
        let contractKey = this._createContractKey(perfomerId, customerId, contractId);
        assert.true(this._activeContracts[contractKey], "Contract with this parameters(perfomerId, customerId, contractId) doesn't exist or already completed");

        return this._activeContracts[contractKey].changeInfoFromOrderEDIT(newInfoFromOrderEDIT);
    }


    changeInfoFromOfferEDIT(perfomerId, customerId, contractId, newInfoFromOfferEDIT) {
        let contractKey = this._createContractKey(perfomerId, customerId, contractId);
        assert.true(this._activeContracts[contractKey], "Contract with this parameters(perfomerId, customerId, contractId) doesn't exist or already completed");

        return this._activeContracts[contractKey].changeInfoFromOfferEDIT(newInfoFromOfferEDIT);
    }


    completeTheContract(perfomerId, customerId, contractId) {
        let contractKey = this._createContractKey(perfomerId, customerId, contractId);
        assert.true(this._activeContracts[contractKey], "Contract with this parameters(perfomerId, customerId, contractId) doesn't exist or already completed");
        this._activeContracts[contractKey].contractIsCompleted();
        this._completedContracts[contractKey] = this._activeContracts[contractKey];
        this._activeContracts[contractKey] = undefined;
    }
}

let agreementContract = {
    contractParams: {
        contractCompleted: false,
        perfomerInfo: '',
        customerInfo: '',
        infoFromOrderCONSTANT: '',
        infoFromOrderEDIT: '',
        infoFromOfferCONCTANT: '',
        infoFromOfferEDIT: '',
    },


    //factory = msg.sender;


    create: function(perfomer, customer, orderCONST, orderEDIT, offerCONST, offerEDIT){
        this.contractParams.contractCompleted = false;
        this.contractParams.perfomerInfo = perfomer;
        this.contractParams.customerInfo = customer;
        this.contractParams.infoFromOrderCONSTANT = orderCONST;
        this.contractParams.infoFromOrderEDIT = orderEDIT;
        this.contractParams.infoFromOfferCONCTANT = offerCONST;
        this.contractParams.infoFromOfferEDIT = offerEDIT;

        return this;
    },
    changeInfoFromOrderEDIT: function (newInfoFromOrderEDIT) {
        assert.false(this.contractParams.contractCompleted, "contract already completed");
        this.contractParams.infoFromOrderEDIT = newInfoFromOrderEDIT;
    },
    changeInfoFromOfferEDIT: function(newInfoFromOfferEDIT) {
        assert.false(this.contractParams.contractCompleted, "contract already completed");
        this.contractParams.infoFromOfferEDIT = newInfoFromOfferEDIT;
    },
    contractIsCompleted: function() {
        assert.false(this.contractParams.contractCompleted, "contract already completed");
        require(msg.sender == factory, "Only Factory can call this function");
        this.contractParams.contractCompleted = true;
    }
};

global.registerContract(factoryContract);