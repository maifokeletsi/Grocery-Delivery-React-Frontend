import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { buttonStyle } from './buttonStyles';

export default function EditItem() {
  const { itemId, theOrderCode } = useParams();

  const [data, setData] = useState(null);
  const [item, setItem] = useState({
    groceryItem: '',
    itemBrand: '',
    itemSize: '',
    numOfItems: '',
    itemId: itemId,
    theOrderCode: theOrderCode,
  });
  const [error, setError] = useState(null);

  // Function to fetch a specific grocery item
  const fetchOrderItem = async (itemId, theOrderCode) => {
    try {
      const response = await axios.get('http://localhost/nodesdeliveries-backend/grocerycontr-api.php', {
        params: {
          action: 'get',
          itemId: itemId,
          theOrderCode: theOrderCode
        }
      });

      setData(response.data);
      setItem(response.data[0]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchOrderItem(itemId, theOrderCode);
  }, []);

  const navigate = useNavigate();

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      // Perform a PUT or PATCH request to update the data
      await axios.put('http://localhost/nodesdeliveries-backend/grocerycontr-api.php', {
        action: 'update',
        groceryItem: item.groceryItem,
        itemBrand: item.itemBrand,
        itemSize: item.itemSize,
        numOfItems: item.numOfItems,
        itemId: itemId,
        theOrderCode: theOrderCode,
      });
      navigate('/viewItems');
      alert('Successfully Updated The Item');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <h2 className="mb-4">Edit Grocery Item</h2>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="groceryItem">
              <Form.Label>Grocery Item</Form.Label>
              <Form.Control type="text" name="groceryItem" placeholder="Grocery Item" onChange={handleChange} value={item.groceryItem} required />
            </Form.Group>

            

            <Form.Group className="mb-3" controlId="itemSize">
              <Form.Label>Item Size</Form.Label>
              <Form.Control type="text" name="itemSize" placeholder="Item Size" onChange={handleChange} value={item.itemSize} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="numOfItems">
              <Form.Label>Number of Items</Form.Label>
              <Form.Control type="text" name="numOfItems" placeholder="Number of Items" onChange={handleChange} value={item.numOfItems} required />
            </Form.Group>

            <Button type="submit" style={buttonStyle}>
              Update Item
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
