import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';

const API_KEY = '78aadbeda3580e6813514b8d58edd1c3d691c0496814b505d3d17a23692a710c';
const CryptoCompare = () => {

  const [cryptoList, setCryptoList] = useState(['doge', 'btc', 'eth'])

  const [cryptoData, setCryptoData] = useState({})

  useEffect(() => {
   
    updateCryptoChanges()
    const interval = setInterval(updateCryptoChanges, 5000)
    return () => clearInterval(interval)
  }, [])

  
  const updateCryptoChanges = () => {
    cryptoList.forEach((crypto => {
      axios
    .get(`https://min-api.cryptocompare.com/data/price?fsym=${crypto.toUpperCase()}&tsyms=USD&api_key=${API_KEY}`)
    .then(response => {
      const newData = response.data;
      if (newData && newData.USD) {
        setCryptoData((prevCryptoData) => ({
          ...prevCryptoData,
          [crypto]: newData.USD
        }));
      }
      else {
        alert('Cryptocurrency not found')
      }
    })
    .catch((error) => {
      console.error('Error fetching Dogecoin price:', error)
    })
    }))
  }

  const searchedCryptos = cryptoList.map((crypto) => {
    return (
      <li key={crypto}>
        {crypto.toUpperCase()}: ${cryptoData[crypto]}
      </li>
    )
  })
  
  return (
    <div>

      <ul>{searchedCryptos}</ul>
      
    </div>
  )
}

export default CryptoCompare