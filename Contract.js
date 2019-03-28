'use strict';

class Contract {
    constructor() {
        this._activeContracts = new Map();
        this._completedContracts = new Map();

        let contractIdentifier = {perfomerId: "Вася", customerId: "Петя", contractId: "1"};
        var perfomerInfo = {fName: 'Вася', lName: 'Васечкин'};
        var customerInfo = {fName: 'Петя', lName: 'Петячкин'};
        var infoFromOrderCONSTANT = {};
        var infoFromOrderEDIT = {};
        var infoFromOfferCONSTANT = {};
        var infoFromOfferEDIT = {};

        this._activeContracts.set(
            contractIdentifier,
            {
                perfomerInfo,
                customerInfo,
                infoFromOrderCONSTANT,
                infoFromOrderEDIT,
                infoFromOfferCONSTANT,
                infoFromOfferEDIT
            }
        );
        //console.log(this._activeContracts.get(contractIdentifier));
    }

    getActiveContract(perfomerId, customerId, contractId)
    {
        let contractIdentifier = {perfomerId: perfomerId, customerId: customerId, contractId: contractId};

        //console.log(this._activeContracts);
        //console.log(contractIdentifier);

        if(!this._activeContracts.has(contractIdentifier)){
            return "Contract with this parameters doesn't exist or already completed";
        }
        return this._activeContracts.get(contractIdentifier);

        //console.log(contract);

        //require (activeContracts[perfomerId][customerId][contractId] != 0, "Contract with this parameters doesn't exist or already completed");
        //return activeContracts[perfomerId][customerId][contractId];
    }
}

const factory = new Contract();
let contract = factory.getActiveContract("Вася", "Петя", "1");
console.log(contract);