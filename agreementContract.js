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
 * Agreement contract
 */
class agreementContract {

    init(perfomer, customer, orderCONST, orderEDIT, offerCONST, offerEDIT) {
        this.contractCompleted = false;
        this.perfomerInfo = perfomer;
        this.customerInfo = customer;
        this.infoFromOrderCONSTANT = orderCONST;
        this.infoFromOrderEDIT = orderEDIT;
        this.infoFromOfferCONCTANT = offerCONST;
        this.infoFromOfferEDIT = offerEDIT;
        //factory = msg.sender;
    }


    changeInfoFromOrderEDIT(newInfoFromOrderEDIT) {
        assert.false(thisContract.contractCompleted, "contract already completed");
        this.infoFromOrderEDIT = newInfoFromOrderEDIT;
    }

    changeInfoFromOfferEDIT(newInfoFromOfferEDIT) {
        assert.false(thisContract.contractCompleted, "contract already completed");
        this.infoFromOfferEDIT = newInfoFromOfferEDIT;
    }

    contractIsCompleted() {
        assert.false(thisContract.contractCompleted, "contract already completed");
        require(msg.sender == factory, "Only Factory can call this function");
        this.contractCompleted = true;
    }
}

global.registerContract(agreementContract);