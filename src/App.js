import './App.css';
import {useState, useEffect} from "react"

function App() {

  const [conversionDropdownIsShowing, setConversionDropdownIsShowing] = useState(false);
  const [rates, setRates] = useState({});
  const [conversionCurrencies, setConversionCurrencies] = useState([]);

  useEffect(() => {
    doFetchConvert()
  }, [])

  function showConversionDropDown() {
    setConversionDropdownIsShowing(!conversionDropdownIsShowing);
  }


  function doFetchConvert() {
    fetch('https://kc-exchangeratesapi.herokuapp.com/latest')
    .then(response => response.json())
    .then(jsonData => {
        setRates(jsonData['rates']);
    });
  }


  function selectConversionCurrency(clicked_id) {
    let currencyName = clicked_id.target.id;
    let newArray = [...conversionCurrencies, currencyName];
    let content = document.getElementById('maincontent');
    content.innerHTML = "";
    let currencyValues = [];

    removeDuplicate(newArray);
    setConversionCurrencies(newArray);
    
    
    console.log('Currencies:', newArray);

    fetch('https://kc-exchangeratesapi.herokuapp.com/latest')
    .then(response => response.json())
    .then(jsonData => {

      for(let currency of newArray) {
        currencyValues.push(jsonData['rates'][currency]);

        if(newArray.includes(currency)) {
          console.log('turning green:', currency);

          
          let height = jsonData['rates'][currency] * 100;
          let chart = document.createElement('div');
          content.appendChild(chart);
          chart.setAttribute('class', 'BarChart-bar')
          chart.setAttribute('onClick', "alert('1 EUR = " + jsonData['rates'][currency] + " " + currency + "')");
          chart.setAttribute('style', "height: calc(" + height + "px)");
          chart.innerHTML += currency;
          
        }
      }
      
      let max = Math.max(...currencyValues);
      console.log('Currency Values:', currencyValues);
      console.log('Max num:', max);
      
    
    });
    
    if(!newArray.includes(currencyName)) {
      console.log('turning white: ', currencyName);
      content.innerHTML -= currencyName;
    } 
    
  }


// Helper functions to remove duplicates in the conversionCurrency array
  function removeDuplicate(arr){
    let result = false;
    // iterate over the array
    for(let i = 0; i < arr.length;i++) {
       // compare the first and last index of an element
       if(arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])){
          result = true;
          if(result) {
            removeItemAll(arr, arr[i]);
            } 
       }
    }
  }
  function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  


  return (
    <div className="App">
      <div className="NavBar">
        
        <div className="base-currency-dropdown">
            <button className="dropbtn" id="baseButton">Base Currency: EUR</button>
            <div className="dropdown-content-base" id="baseDropDown">
                
            </div>
        </div>
        
        

        <div className="conversion-dropdown">
            <button onClick={showConversionDropDown} className="dropbtn" id="convertButton">Convert to:</button>
            <div 
              className={`dropdown-content-convert ${conversionDropdownIsShowing ? "show" : ""}`}
              id="conversionDropDown"
              >
              {Object.entries(rates).map(([key, value]) => {
                return <button 
                          style={{backgroundColor: conversionCurrencies.includes(key) ? "lightgreen" : "white"}}
                          id={key} 
                          onClick={selectConversionCurrency}
                                             
                        >
                          {key}
                        </button>
              })}
            </div>
        </div>
      </div>

      <div className="MainContent" id="maincontent">
          
      </div>
    </div>
  );
}

export default App;