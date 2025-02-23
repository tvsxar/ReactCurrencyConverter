import './Converter.scss';
import { use, useEffect, useState } from 'react';
import arrows from '../../assets/arrows.svg';

function Converter() {
    // states
    const [currencies, setCurrencies] = useState({});
    const [selectedCurrencyFrom, setSelectedCurrencyFrom] = useState('USD');
    const [selectedCurrencyTo, setSelectedCurrencyTo] = useState('EUR');
    const [amountFrom, setAmountFrom] = useState('');
    const [amountTo, setAmountTo] = useState('');

    // hook

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://v6.exchangerate-api.com/v6/d2681b432bb0b82df4ac768b/latest/USD');
                const data = await response.json();

                if (data.result !== 'success') {
                    throw new Error(`HTTP error! Status: ${data.error}`);
                }
                console.log(data);

                // obj with currency rates
                const rates = data.conversion_rates;
                setCurrencies(rates);
            } catch(error) {
                console.log('Downloading data error:', error);
            }
        }

        fetchData(); 
    }, []);

    // handler
    function handleAmountChange(e, isFromAmount) {
        const value = e.target.value;

        if(isFromAmount) {
            setAmountFrom(value);
            setAmountTo((value * currencies[selectedCurrencyTo] / currencies[selectedCurrencyFrom]).toFixed(2))
        } else {
            setAmountTo(value);
            setAmountFrom((value * currencies[selectedCurrencyFrom] / currencies[selectedCurrencyTo]).toFixed(2))
        }
    }
    

    // currency names
    const currenciesArray = Object.keys(currencies);

    return (
        <div className="converter">
            <div className="currency">
                <div className="currency-title">Amount</div>

                <div className="currency-row">
                    <select value={selectedCurrencyFrom} onChange={e => setSelectedCurrencyFrom(e.target.value)}>
                        {currenciesArray.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>

                    <input value={amountFrom} onChange={e => handleAmountChange(e, true)} 
                    placeholder='0,00' type="number" />
                </div>
            </div>

            <button className='reverse-btn'>
                <img src={arrows} alt="arrows" />
            </button>

            <div className="currency">
                <div className="currency-title">Converted Amount</div>

                <div className="currency-row">
                    <select value={selectedCurrencyTo} onChange={e => setSelectedCurrencyTo(e.target.value)}>
                        {currenciesArray.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>

                    <input value={amountTo} onChange={e => handleAmountChange(e, false)}
                     placeholder='0,00' type="number" />
                </div>
            </div>
        </div>
    )
}

export default Converter;