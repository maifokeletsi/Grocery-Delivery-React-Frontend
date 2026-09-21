import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { buttonStyle } from './buttonStyles';

export default function AcceptOrder() {
  const { amtDue, theOrderCode } = useParams();
  const [formData, setFormData] = useState({
    shoperNumber: '',
    password: '',
  });

  const [phoneNoOfShoper, setPhoneNoOfShoper] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const populateTheAcceptedOrders = async () => {
      try {
        const response = await axios.post(
          'http://localhost/nodesdeliveries-backend/shoper-api.php',
          {
            action: 'populateAcceptedOrders',
            shoperNumber: formData.shoperNumber,
            orderCode: theOrderCode,
            dueAmt: amtDue,
          }
        );

        // Handle the response as needed
      } catch (error) {
        console.log('Error in populateTheAcceptedOrders:', error);
      }
    };

    try {
      const response = await axios.post(
        'http://localhost/nodesdeliveries-backend/shoper-api.php',
        {
          action: 'loginAsShoper',
          orderCode: theOrderCode,
          ...formData,
        }
      );

      if (response.data.status) {
        alert('Successfully ACCEPTED The Order');
        populateTheAcceptedOrders();
        // navigate("/viewItems");
      } else {
        alert('Invalid Password Or Phone No. .');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formShoperNumber">
              <Form.Label>Cellphone No. :</Form.Label>
              <Form.Control
                type="text"
                name="shoperNumber"
                placeholder="Cellphone No."
                value={formData.shoperNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" style={buttonStyle}>
              SUBMIT
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
