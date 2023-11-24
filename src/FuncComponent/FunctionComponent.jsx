import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GoArrowUpRight, GoArrowRight, GoArrowDownRight } from 'react-icons/go';

const API_KEY = '78aadbeda3580e6813514b8d58edd1c3d691c0496814b505d3d17a23692a710c'; // Replace with your actual API key

const CryptoTracker = () => {
  const [trackedCryptos, setTrackedCryptos] = useState(['doge']);
  const [cryptoData, setCryptoData] = useState({});
  const [rateChanges, setRateChanges] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      updateRates();
    }, 5000);
    return () => clearInterval(interval);
  }, [trackedCryptos]);

  const updateRates = () => {
    trackedCryptos.forEach((crypto) => {
      axios
        .get(`https://min-api.cryptocompare.com/data/price?fsym=${crypto.toUpperCase()}&tsyms=USD&api_key=${API_KEY}`)
        .then((response) => {
          const newData = response.data;
          if (newData && newData.USD) {
            const updatedCryptoData = {
              ...cryptoData,
              [crypto]: newData.USD,
            };

            const updatedRateChanges = {
              ...rateChanges,
              [crypto]: (updatedCryptoData[crypto] || 0) > (cryptoData[crypto] || 0)
                ? <GoArrowUpRight className='text-green-500' />
                : (updatedCryptoData[crypto] || 0) < (cryptoData[crypto] || 0)
                ? <GoArrowDownRight className='text-red-500' />
                : <GoArrowRight className='text-gray-300'/>,
            };

            setCryptoData(updatedCryptoData);
            setRateChanges(updatedRateChanges);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    });
  };

  const searchCrypto = () => {
    const cryptoInput = cryptoInputRef.current.value.toLowerCase();
    if (!trackedCryptos.includes(cryptoInput)) {
      fetchCryptoData(cryptoInput);
    } else {
      alert('This cryptocurrency is already in your list.');
    }
    cryptoInputRef.current.value = '';
  };

  const fetchCryptoData = (cryptoName) => {
    axios
      .get(`https://min-api.cryptocompare.com/data/price?fsym=${cryptoName.toUpperCase()}&tsyms=USD&api_key=${API_KEY}`)
      .then((response) => {
        const data = response.data;
        if (data && data.USD) {
          setTrackedCryptos((prevCryptos) => [...prevCryptos, cryptoName]);
        } else {
          alert('Cryptocurrency not found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const deleteCrypto = (cryptoName) => {
    setTrackedCryptos((prevCryptos) => prevCryptos.filter((crypto) => crypto !== cryptoName));
  };

  const cryptoInputRef = useRef();

  const cryptoList = trackedCryptos.map((crypto) => {
    const rate = cryptoData[crypto] || 0;

    return (
      <li className='w-1/2 flex ' key={crypto}>
        <div className='w-full bg-sky-700 flex justify-between p-3 rounded-l-lg'>
          <p>{crypto.toUpperCase()}: </p>
          <p className='flex items-center gap-x-2'>${rate} <span className='text-3xl '>{rateChanges[crypto]}</span></p>
        </div>
        <button className='w-24 px-4 py-3 rounded-r-lg bg-red-500 ' onClick={() => deleteCrypto(crypto)}>Delete</button>
      </li>
    );
  });

  return (
    <div className='mt-10 text-2xl'>
      <h1 className='text-center text-4xl font-semibold mb-6'>CryptoCompare</h1>
      <div className='flex justify-center '>
        <div className='w-1/2 flex'>
          <input
            className='w-full border-2 rounded-l-lg border-blue-500 p-2'
            type='text'
            ref={cryptoInputRef}
            placeholder='Enter cryptocurrency name'
          />
          <button className='w-24 rounded-r-lg p-3 bg-teal-500 text-white' onClick={searchCrypto}>
            Search
          </button>
        </div>
      </div>
      <ul className='my-8 flex flex-col items-center gap-y-6 text-white'>{cryptoList}</ul>
    </div>
  );
};

export default CryptoTracker;
