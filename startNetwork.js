const logger = new (require(global.PATH.mainDir + '/modules/logger'))("NetworkStart");
const assert = require(global.PATH.mainDir + '/modules/testing/assert');
const DApp = require(global.PATH.mainDir + '/app/DApp');
const fs = require('fs');


let that;

/**
 * Master contract
 */
const masterContract = fs.readFileSync('./factoryContract.js').toString();


/**
 * Deploy master contracts APP
 */
class App extends DApp {


    /**
     * Initialize
     */
    init() {
        that = this;

        process.on('SIGINT', () => {
            console.log('Terminating deploy...');
            process.exit();
        });

        process.on('unhandledRejection', error => {
            logger.fatal(error);
            process.exit();
        });

        //Preparing environment
        logger.info('Deploying contract...');
        that.contracts.ecmaContract.deployContract(masterContract, 0, async function (deployedContract) {
            logger.info("Master contract deployed " + deployedContract.address);
        });


    }


}

module.exports = App;
