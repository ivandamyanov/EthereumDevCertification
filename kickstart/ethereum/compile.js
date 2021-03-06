const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

var input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: fs.readFileSync(campaignPath, 'utf8')
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

fs.ensureDirSync(buildPath);

var output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract + '.json'),
    output[contract]
  )
}
