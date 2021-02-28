import './App.css';
import web3 from './web3';
import React, { Component } from 'react';
import lottery from './lottery';

class App extends Component {

  async componentDidMount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    result: ''
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ result: 'Transaction pending...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ result: 'You have entered successfully!' });
  };

  onClick = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ result: 'Picking a winner...' });
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    this.setState({ result: 'Fantastic, a winner has been picked!' });
  }

  render() {
    return (
      <div className="App">
        <h2>Lottery contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} people competing 
          to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4>Wanna try your luck?</h4>
          <div>
            <label>Amount of ETH to enter: </label>
            <input onChange={event => this.setState({ value: event.target.value })}></input>
          </div>
          <button>Enter</button>
        </form>
        <hr/>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick winner</button>
        <hr/>
        <h1>{this.state.result}</h1>
      </div>
    );
  }

  /*  async loadWeb3() {
     if (window.ethereum) {
       try {
         window.web3 = new Web3(window.ethereum);
         const acc = await window.web3.eth.getAccounts();
         console.log(acc);
         //const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
         //save accounts
       }
       catch (error){
         if (error.code === 4001) {
           window.alert("Permission denied!");
           // User rejected request
         }
       }
     }
     else if (window.web3) {
       window.web3 = new Web3(window.web3.currentProvider);
     }
     else {
       window.alert('Non-Ethereum browser detected. You should consider trying out Metamask!')
     }
   } */
}
export default App;
