const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({ gasLimit: 10000000 }));

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '10000000' });

    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '10000000' });

    // ES2016 destructure [] and take the first element
    [campaignAddress] = await factory.methods.getCampaigns().call();
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(manager, accounts[0]);
    });

    it('allows people to contribute and marks them as approvers', async () => {
        await campaign.methods.contribute().send({ from: accounts[1], value: '200' });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({ from: accounts[1], value: '5' });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest('Buy batteries', '100', accounts[1]).send({ from: accounts[0], gas: '10000000' });
        const request = await campaign.methods.requests(0).call();
        assert.strictEqual('Buy batteries', request.description);
    });

    it('processes request', async () => {
        await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei('10', 'ether')});
        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1]).send({ from: accounts[0], gas: '10000000' });
        await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: '10000000'});
        await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '10000000'});

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance);
        // previous tests can ruin that one here because of how ganache handles account balances in between tests
        assert(balance > 103)
    });
});