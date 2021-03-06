import Web3 from 'web3';
//I had to convert to create-next-app  in order to take advantage of the dotenv functionality
//TODO: https://github.com/vercel/next.js/issues/3352 check and try solution

let web3;

function loadWeb3() {
  if (window.ethereum) {
    try {
      window.web3 = new Web3(window.ethereum);
      return window.web3;
    }
    catch (error) {
      if (error.code === 4001) {
        window.alert("Permission denied!");
      }
    }
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    return window.web3;
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying out Metamask!')
  }
};

if (typeof window !== 'undefined') {
  web3 = loadWeb3();
}
else // server side
{ 
  const provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );
  web3 = new Web3(provider);
}

export default web3;