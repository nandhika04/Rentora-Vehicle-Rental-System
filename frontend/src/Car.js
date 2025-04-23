// import React, { useState } from 'react'; // Import React and useState
// import './bike.css'; // Import the CSS file for styles
// import yamaha from './tc.webp'; // Import images
// import bike from './md.webp';
// import triumph from './ms.webp';
// import ather from './hc.webp';
// import honda from './mb.webp';
// import keeway from './tf.webp';
// import bmw from './mfx.webp';
// import m from './tp.webp';
// import hero from './tn.webp';
// import baj from './tp.webp';
// import Car from './Car'; 
// import Bform from './Bform'; 

// const Bike = () => {
//   const [currentView, setCurrentView] = useState('bike'); // State to manage the current view

//   const handleNavigate = (view) => {
//     setCurrentView(view); // Change the current view based on button clicks
//   };

//   return (
//     <div className="bike-page">
//         {currentView === 'car' && <Car />} 
//         {currentView === 'Bform' && <Bform />} 
//       {currentView === 'bike' && (
//         <>
//           <div className="grid-container">
//             <div className="grid-item1">
//               <img src={yamaha} height="100" width="200" alt="Yamaha MT 15" /><br />
//               <span className="one">RIDE WITH NEW TATA CURVV</span><br />
//               <span className="price">₹1880 per day</span><br />
//               100km limit<br />
             
//               3 Seater<br />
//               Fuel Excluded<br />
//               <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
//             </div>
//             <div className="grid-item">
//               <img src={bike} height="100" width="200" alt="Royal Enfield Hunter 350" /><br />
//               Maruti Dzire<br />
//               <span className="price">₹1030 per day</span><br />
//               100km limit<br />
             
//               4 Seater<br />
//               Fuel Excluded<br />
//               <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
//             </div>
//             <div className="grid-item">
//               <img src={triumph} height="100" width="200" alt="Triumph Tiger 1200" /><br />
//             Maruti Swift<br />
//             <span className="price">₹1400 per day</span><br />
//               100km limit<br />
//               4 Seater<br />
//               Fuel Excluded<br />
//               <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
//             </div>
//             <div className="grid-item">
//               <img src={ather} height="100" width="200" alt="Ather Energy 450" /><br />
//               Hyundai Creta<br />
//               <span className="price">₹1300 per day</span><br />
//               100km limit<br />

//               4 Seater<br />
//               Fuel Excluded<br />
//               <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
//             </div>
//             <div className="grid-item">
//               <img src={honda} height="100" width="200" alt="Honda CB300F" /><br />
//               Honda CB300F<br />
//               <span className="price">₹1880 per day</span><br />
//               100km limit<br />
//               2 Seater<br />
//               Fuel Excluded<br />
//               <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
//             </div>
//             <div className="grid-item">
//               <img src={keeway} height="100" width="200" alt="Keeway Vieste 300" /><br />
//               Maruti Brezza<br />
//               <span className="price">₹2080 per day</span><br />
//               100km limit<br />
//               6 Seater<br />
//               Fuel Excluded<br />
//               <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
//             </div>
//             <div className="grid-item">
//               <img src={m} height="100" width="200" alt="Maisto 2021 Yamaha" /><br />
//               Toyota Fortuner<br />
//               <span className="price">₹1580 per day</span><br />
//               100km limit<br />
//               2 Seater<br />
//               Fuel Excluded<br />
//               <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
//             </div>
//             <div className="grid-item">
//               <img src={hero} height="100" width="200" alt="Hero Glamour 125" /><br />
//               Maruti FRONX<br />
//               <span className="price">₹1480 per day</span><br />
//               100km limit<br />
//               2 Seater<br />
//               Fuel Excluded<br />
//               <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
//             </div>
//             <div className="grid-item">
//               <img src={baj} height="100" width="200" alt="Bajaj Pulsar" /><br />
//               Tata Punch<br />
//               <span className="price">₹1870 per day</span><br />
//               100km limit<br />
//               2 Seater<br />
//               Fuel Excluded<br />
//               <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
//             </div>
//             <div className="grid-item9">
//               <img src={bmw} height="100" width="200" alt="BMW G 310 RR" /><br />
//               <span className="one">RIDE WITH NEW TATA NEXON</span><br />
//               <span className="price">₹1880 per day</span><br />
//               100km limit<br />
//               2 Seater<br />
//               Fuel Excluded<br />
//               <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
//             </div>
//           </div>
//         </>
//       )}

//       {currentView === 'car' && <Car />} {/* Render the Car component if the view is 'car' */}
//     </div>
//   );
// };

// export default Bike;