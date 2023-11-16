import React, { Component } from 'react';
import axios from 'axios';
import { GoArrowUpRight, GoArrowRight, GoArrowDownRight } from "react-icons/go";

const API_KEY = '78aadbeda3580e6813514b8d58edd1c3d691c0496814b505d3d17a23692a710c'; // Replace with your actual API key

class CryptoTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackedCryptos: ['doge'],
      cryptoData: {},
      rateChanges: {},
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.updateRates();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateRates = () => {
    const { trackedCryptos, cryptoData: prevCryptoData, rateChanges } = this.state;
    trackedCryptos.forEach((crypto) => {
      axios
        .get(`https://min-api.cryptocompare.com/data/price?fsym=${crypto.toUpperCase()}&tsyms=USD&api_key=${API_KEY}`)
        .then((response) => {
          const newData = response.data;
          if (newData && newData.USD) {
            const updatedCryptoData = {
              ...prevCryptoData,
              [crypto]: newData.USD,
            };

            const updatedRateChanges = {
              ...rateChanges,
              [crypto]: (updatedCryptoData[crypto] || 0) > (prevCryptoData[crypto] || 0)
                ? <GoArrowUpRight className='text-green-500' />
                : (updatedCryptoData[crypto] || 0) < (prevCryptoData[crypto] || 0)
                ? <GoArrowDownRight className='text-red-500' />
                : <GoArrowRight className='text-gray-300'/>,
            };

            this.setState({
              cryptoData: updatedCryptoData,
              rateChanges: updatedRateChanges,
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    });
  };
  

  searchCrypto = () => {
    const { trackedCryptos } = this.state;
    const cryptoInput = this.refs.cryptoInput.value.toLowerCase();
    if (!trackedCryptos.includes(cryptoInput)) {
      this.fetchCryptoData(cryptoInput);
    } else {
      alert('This cryptocurrency is already in your list.');
    }
    this.refs.cryptoInput.value = '';
  };

  fetchCryptoData = (cryptoName) => {
    axios
      .get(`https://min-api.cryptocompare.com/data/price?fsym=${cryptoName.toUpperCase()}&tsyms=USD&api_key=${API_KEY}`)
      .then((response) => {
        const data = response.data;
        if (data && data.USD) {
          this.setState((prevState) => ({
            trackedCryptos: [...prevState.trackedCryptos, cryptoName],
          }));
        } else {
          alert('Cryptocurrency not found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  deleteCrypto = (cryptoName) => {
    this.setState((prevState) => ({
      trackedCryptos: prevState.trackedCryptos.filter((crypto) => crypto !== cryptoName),
    }));
  };



  render() {
    const { trackedCryptos, cryptoData, rateChanges } = this.state;

    const cryptoList = trackedCryptos.map((crypto) => {
      const rate = cryptoData[crypto] || 0;

      return (
        <li className='w-1/2 flex ' key={crypto}>
          <div className='w-full bg-sky-700 flex justify-between p-3 rounded-l-lg'>
            <p>{crypto.toUpperCase()}: </p>
            <p className='flex items-center gap-x-2'>${rate} <span className='text-3xl '>{rateChanges[crypto]}</span></p>
            
          </div>
          <button className='w-24 px-4 py-3 rounded-r-lg bg-red-500 ' onClick={() => this.deleteCrypto(crypto)}>Delete</button>
        </li>
      );
    });

    return (
        <div className='mt-10 text-2xl'>
          <h1 className='text-center text-4xl font-semibold mb-6'>CryptoCompare</h1>
          
            
              <div className='flex justify-center '>
              <div className='w-1/2 flex'>
                <input className='w-full border-2 rounded-l-lg border-blue-500 p-2' type="text" ref="cryptoInput" placeholder="Enter cryptocurrency name" />
                <button className='w-24 rounded-r-lg p-3 bg-teal-500 text-white' onClick={this.searchCrypto}>Search</button>
              </div>
              </div>
          
          <ul className ='my-8 flex flex-col items-center gap-y-6 text-white'>{cryptoList}</ul>
          
        </div>
      
    );
  }
}

export default CryptoTracker;
