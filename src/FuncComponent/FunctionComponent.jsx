import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';

const API_KEY = '78aadbeda3580e6813514b8d58edd1c3d691c0496814b505d3d17a23692a710c';
const CryptoCompare = () => {

  const [crypto, setCrypto] = useState('btc')

  const [cryptoRate, setCryptoRate] = useState(null)

  useEffect(() => {
   
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  
  const fetchData = () => {
    axios
    .get(`https://min-api.cryptocompare.com/data/price?fsym=${crypto.toUpperCase()}&tsyms=USD&api_key=${API_KEY}`)
    .then(response => {
      const newData = response.data;
      if (newData && newData.USD) {
        setCryptoRate(newData.USD);
      }
      else {
        alert('Cryptocurrency not found')
      }
    })
    .catch((error) => {
      console.error('Error fetching Dogecoin price:', error)
    })
  }
  
  return (
    <div>

      <h1>{crypto}: {cryptoRate}</h1>
      
    </div>
  )
}

export default CryptoCompare