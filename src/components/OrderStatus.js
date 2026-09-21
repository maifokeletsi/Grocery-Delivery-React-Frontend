import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Alert } from 'react-bootstrap';

export default function OrderStatus({ theOrderCode, handleCheckOrder, orderExists, orderIsAccepted, orderIsDelivered, updateOrderStatus }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [cellNumberOfShoper, setCellNumberOfShoper] = useState(null);
  const [deliveryCodeFrmDB, setDeliveryCodeFrmDB] = useState(null);
  const [orderIsAcceptedDB, setOrderIsAcceptedDB] = useState(0);
  const [orderIsDeliveredDB, setOrderIsDeliveredDB] = useState(0);
  const [cellNoOfReqUser, setCellNoOfReqUser] = useState('');

  useEffect(() => {
    const fetchCellNumberReqUser = async (orderCode) => {
      try {
        const response = await axios.get('http://localhost/nodesdeliveries-backend/req-user-api.php', {
          params: {
            action: 'cellNoOfReqUser',
            orderCode: orderCode,
          },
        });
        setCellNoOfReqUser(response.data[0].reqUserNumber);
      } catch (error) {
        setError(error.message);
      }
    };

    const updateOrderStatusFrmDB = async (theOrderCode) => {
      try {
        const response = await axios.get('http://localhost/nodesdeliveries-backend/req-user-api.php', {
          params: {
            action: 'getOrderStatus',
            theOrderCode: theOrderCode
          }
        });

        console.log('response.data[0].orderIsAccepted: ' + response.data[0].orderIsAccepted);
        setOrderIsAcceptedDB(response.data[0].orderIsAccepted);
        setOrderIsDeliveredDB(response.data[0].orderIsDelivered);
      } catch (error) {
        console.log(error.message);
      }
    };

    updateOrderStatusFrmDB(theOrderCode);
    fetchAllHierachyOrderedItems(theOrderCode);
    handleCheckOrder(theOrderCode);
    fetchCellNumberOfShoper(theOrderCode);

    fetchCellNumberReqUser(theOrderCode);
  }, [theOrderCode]);

  const fetchAllHierachyOrderedItems = async (orderCode) => {
    try {
      const response = await axios.get('http://localhost/nodesdeliveries-backend/grocerycontr-api.php', {
        params: {
          action: 'hierachyOrderedItems',
          theOrderCode: orderCode,
        },
      });

      setData(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchCellNumberOfShoper = async (orderCode) => {
    try {
      const response = await axios.get('http://localhost/nodesdeliveries-backend/req-user-api.php', {
        params: {
          action: 'cellNoOfShoperAndDeliveryCode',
          theOrderCode: orderCode,
        },
      });

      setCellNumberOfShoper(response.data.cellNumOfShoper);
      setDeliveryCodeFrmDB(response.data.deliveryCode);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Track Order</h2>
          {(orderExists === false) && <Alert variant="info">Order Status: Not Yet Placed</Alert>}
          {deliveryCodeFrmDB && <Alert variant="info">Verify Delivery OTP: {deliveryCodeFrmDB}</Alert>}
          {cellNoOfReqUser && <Alert variant="info">Your Phone No.: {cellNoOfReqUser}</Alert>}
          {cellNumberOfShoper && <Alert variant="info">Shopper's Phone No.: {cellNumberOfShoper}</Alert>}
          {orderExists && <Alert variant="info">Order Status: Placed</Alert>}
          {console.log("orderIsAcceptedDB: " + orderIsAcceptedDB)}
          {(orderIsAcceptedDB == 1) ? <Alert variant="info">Order Status: Accepted</Alert> : <></>}
          {(orderIsDeliveredDB == 1) ? <Alert variant="info">Order Status: Delivered</Alert> : <></>}

          {orderExists &&
            <div>
              <h4>Ordered Items</h4>
              <ul>
                {Array.isArray(data) && data.map((item, index) => (
                  <li key={item.itemId}>
                    <p>Grocery Item: {item.groceryItem} || Brand: {item.itemBrand} || Size: {item.itemSize} || Number of Items: {item.numOfItems} || Shopping Item <strong>{index + 1}</strong> Hierarchy</p>
                  </li>
                ))}
              </ul>
              {error && (
                <div>
                  <h2>Error:</h2>
                  <p>{error}</p>
                </div>
              )}
            </div>}
        </Col>
      </Row>
    </Container>
  );
}
