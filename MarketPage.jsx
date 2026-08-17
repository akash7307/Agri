import React, { useState } from 'react';

// Complete list of Indian States
const STATES = [
  "Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// Comprehensive list of agricultural commodities (Crops)
const CROPS = [
  "Apple", "Bajra(Pearl Millet)", "Banana", "Barley (Jau)", "Bengal Gram(Gram)(Whole)", 
  "Bhindi(Ladies Finger)", "Bitter gourd", "Bottle gourd", "Brinjal", "Cabbage", 
  "Capsicum", "Carrot", "Cauliflower", "Chilly Capsicum", "Cotton", "Garlic", 
  "Ginger(Green)", "Gram Raw(Chholia)", "Green Chilli", "Groundnut", "Guava", 
  "Jowar(Sorghum)", "Lemon", "Maize", "Mango", "Masur Dal", "Moong(Green Gram)", 
  "Mustard", "Onion", "Paddy(Dhan)(Common)", "Papaya", "Pomegranate", "Potato", 
  "Pumpkin", "Radish", "Rice", "Soyabean", "Spinach", "Sugarcane", "Tomato", "Wheat"
];

export default function MarketPage() {
  // Default selected values
  const [selectedState, setSelectedState] = useState("Uttar Pradesh");
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Function to fetch live data directly from the Government API
  const fetchPrices = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      // 1. Fetch the API key from the .env file securely
      const API_KEY = import.meta.env.VITE_MARKET_API_KEY; 
      
      if (!API_KEY) {
        console.error("API Key is missing! Please check your frontend .env file.");
      }
      
      // 2. Direct URL for the Data.gov.in API
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=15&filters[state]=${selectedState}&filters[commodity]=${selectedCrop}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // 3. Extract the data and handle cases where modal_price might be zero or missing
      const validRecords = (data.records || []).map(item => ({
        market: item.market,
        district: item.district,
        state: item.state,
        arrival_date: item.arrival_date,
        variety: item.variety,
        modal_price: item.modal_price || "N/A"
      }));

      setPrices(validRecords);
    } catch (error) {
      console.error("Error fetching prices:", error);
      setPrices([]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-t-xl shadow-md border-b-4 border-yellow-400">
        <h2 className="text-3xl font-extrabold text-green-800 mb-2">🌾 Live Market Prices</h2>
        <p className="text-gray-600 mb-6">Check live, accurate agricultural commodity prices directly from Government Mandis (Markets) across India.</p>
        
        {/* Dropdowns & Search Button */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-2/5">
            <label className="block text-sm font-bold text-gray-700 mb-2">Select State</label>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 cursor-pointer"
            >
              {STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-2/5">
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Crop</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 cursor-pointer"
            >
              {CROPS.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/5">
            <button 
              onClick={fetchPrices}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold p-3 rounded-lg shadow-lg transition duration-200"
            >
              Check Prices 🔍
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gray-50 p-6 rounded-b-xl shadow-md min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-full mt-10">
            <p className="text-xl font-bold text-green-600 animate-pulse">⏳ Fetching live market prices...</p>
          </div>
        ) : hasSearched && prices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prices.map((item, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{item.market} Market</h3>
                    <p className="text-sm text-gray-600">{item.district}, {item.state}</p>
                    <p className="text-xs text-gray-400 mt-2">Arrival Date: {item.arrival_date}</p>
                    <p className="text-xs text-gray-400">Variety: {item.variety}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mb-1 inline-block">Live Price</span>
                    <p className="text-2xl font-black text-green-700">₹{item.modal_price}</p>
                    <p className="text-xs font-semibold text-gray-500">/ Quintal</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hasSearched && prices.length === 0 ? (
          <div className="text-center mt-10 p-6 bg-red-50 rounded-lg border border-red-200">
            <p className="text-lg font-bold text-red-600">⚠️ No Recent Prices Found</p>
            <p className="text-gray-600 mt-2">It appears that there are no recently updated prices for <b>{selectedCrop}</b> in <b>{selectedState}</b> today. Please try a different state or crop combination.</p>
          </div>
        ) : (
          <div className="text-center mt-16 text-gray-400">
            <p className="text-lg font-medium">Select your state and crop above, then click "Check Prices" to view live data.</p>
          </div>
        )}
      </div>
    </div>
  );
}