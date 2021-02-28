const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

var input = {
    language: 'Solidity',
    sources: {
      'Lottery.sol': {
        content: fs.readFileSync(lotteryPath, 'utf8')
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  
  var output = JSON.parse(solc.compile(JSON.stringify(input)));
  //console.log(output.contracts['Lottery.sol']['Lottery'].abi);
  //console.log(output.contracts['Lottery.sol']['Lottery']['evm'].bytecode); to get bytecode
  module.exports = output.contracts['Lottery.sol']['Lottery'];