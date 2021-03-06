import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, '0x8fe8E68449a7b5c72791620E7031f9370166214b');

export default instance;