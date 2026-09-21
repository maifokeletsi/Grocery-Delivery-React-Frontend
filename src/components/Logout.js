import React,  { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

const Logout = ({setTheOrderCode, theOrderCode, handleCheckOrder, orderExists}) => {
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleCheckOrder(theOrderCode);

    if (orderExists) {
     
      handleConfirmation();
      
    } else {
      
      setMsg('Did NOT LOG OUT.Since You Do Not Have Account YET.');
    }
  }, [theOrderCode]);

   
  const handleConfirmation = () => {
    const userConfirmed = window.confirm('Are you sure you want LOG OUT?');
   

    if (userConfirmed) {
      navigate("/trackOrder/");
      setTheOrderCode(uuidv4());
    } else {
      navigate("/viewItems");
    }
  };




  return (
    <>
    {msg &&  <Alert variant="info">{ msg } </Alert>}
    </>
  );
};

export default Logout;
