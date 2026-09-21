import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

const OrdersList = () => {
  const [dataList, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost/nodesdeliveries-backend/req-user-api.php', {
          params: {
            action: 'ordersToShopers',
          },
        });

        setData(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      {(dataList.length > 0) ? 
        dataList.map((data, index) => (
          <Row key={index} className="mb-4">
            <Col xs={12} md={6}>
              <h5>Estimated Cost: <strong>R{data.dueAmt}</strong></h5>
              <h5>Requesting Number: {data.reqUserNumber}</h5>
            </Col>
            <Col xs={12} md={6}>
              <Link to={`/acceptOrder/${data.dueAmt}/${data.orderCode}`} className="btn btn-info mr-2">
                <Button>Accept Order</Button>
              </Link>
            </Col>
            <Col xs={12}>
              <ul>
                {data.itemsOrdered.map((item, i) => (
                  <li key={i}>
                    <strong>Grocery Item </strong> - {item.groceryItem}, <strong>Item Brand</strong> - {item.itemBrand},{' '}
                    <strong>Item Size</strong> - {item.itemSize}, <strong>Number Of Items</strong> - {item.numOfItems}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        ))
          :
          <div style={{margin: "3%"}}>
          <Alert variant="info">Currently There Are No Orders</Alert>
          </div>}
    </Container>
  );
};

export default OrdersList;
