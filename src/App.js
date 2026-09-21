import './App.css';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

//import components
import FetchProducts from './components/FetchProducts'; 
import NavBar from './components/NavBar';
import Home from './components/Home';
import EditItem from './components/EditItem';
import SignUpForm from './components/SignUpForm';
import AuthComponent from './components/AuthComponent ';
import ContactUs from './components/ContactUs';
import OrderStatus from './components/OrderStatus';
import Logout from './components/Logout';
import GroceryItemsList from './components/GroceryItemsList';
import OrdersList from './components/OrdersList';
import AcceptOrder from './components/AcceptOrder';
import DeliveryOfficialsLogIn from './components/VerifyDelivery';

function App() {

  const [orderIsPayed, setOrderIsPayed] = useState(false);
  const [orderIsAccepted, setOrderIsAccepted] = useState(false);
  const [orderIsDelivered, setOrderIsDelivered] = useState(false);
  const [orderExists, setOrderExists] = useState(false);
  const [displayOrderToPublic, setDisplayOrderToPublic] = useState(true);
  const [theOrderCode, setTheOrderCode] = useState(
    localStorage.getItem('variable1') || uuidv4());

  // useEffect to update localStorage whenever variables change
  useEffect(() => {
    localStorage.setItem('variable1', theOrderCode);
  }, [theOrderCode]);

  const handleVariable1Change = (newValue) => {
    setTheOrderCode(newValue);
  };

  const handleCheckOrder = async (theOrderCode) => {
    try {
      const response = await axios.post('http://localhost/nodesdeliveries-backend/checkOrderExist.php', {
        theOrderCode: theOrderCode,
      });

      if (response.data.exists) {
        setOrderExists(true);
      } else {
        setOrderExists(false);
      }
    } catch (error) {
      console.error('Error checking order:', error.message);
    }
  };


 

  useEffect(() => {
    const updateOrderStatus = async (theOrderCode) => {
      try {
        const response = await axios.get('http://localhost/nodesdeliveries-backend/req-user-api.php', {
          params: {
            action: 'getOrderStatus',
            theOrderCode: theOrderCode
          }
        });
        setOrderIsAccepted(response.data[0].orderIsAccepted);
        setOrderIsDelivered(response.data[0].orderIsDelivered);
        setDisplayOrderToPublic(response.data[0].displayOrderToPublic);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (orderExists) {
      updateOrderStatus(theOrderCode);
    }
  }, []);


  return (
    <div className="App">
      <BrowserRouter>
        <NavBar></NavBar>
        <Routes>
          <Route index element={<Home theOrderCode={theOrderCode} setTheOrderCode={setTheOrderCode} />} />
          <Route path="/viewItems"
            element=
            {<GroceryItemsList
              theOrderCode={theOrderCode}

            />}
          />
          <Route path="/FetchProducts" element={<FetchProducts theOrderCode={theOrderCode}></FetchProducts>} />
          <Route path="/edit/:itemId/:theOrderCode" element={<EditItem />} />
          <Route path="/acceptOrder/:amtDue/:theOrderCode" element={<AcceptOrder />} />
          <Route path="/payTheOrder/:theOrderCode"
            element={<SignUpForm orderIsPayed={orderIsPayed}
              orderIsAccepted={orderIsAccepted}
              orderIsDelivered={orderIsDelivered}
              displayOrderToPublic={displayOrderToPublic} 
              setOrderIsAccepted={ setOrderIsAccepted} 
              setOrderIsDelivered={setOrderIsDelivered}
              setDisplayOrderToPublic={setDisplayOrderToPublic}/>} />
          <Route path="/trackOrder/" element={<AuthComponent handleVariable1Change={handleVariable1Change} />} />
          <Route path="contactUs" element={<ContactUs />} />
          <Route path="viewMyOrder" element={
            <OrderStatus
              handleCheckOrder={handleCheckOrder}
              orderExists={orderExists}
              orderIsAccepted={orderIsAccepted}
              orderIsDelivered={orderIsDelivered}
              theOrderCode={theOrderCode}
            />} />
          <Route path="/logout" element={<Logout
            setTheOrderCode={setTheOrderCode}
            theOrderCode={theOrderCode}
            handleCheckOrder={handleCheckOrder}
            orderExists={orderExists} />} />
            <Route path="/viewOrders" element={<OrdersList/>}/>
            <Route path="/deliveryOfficialsLogIn"
            element=
            {<DeliveryOfficialsLogIn
             
            />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
