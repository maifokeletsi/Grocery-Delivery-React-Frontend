import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { buttonStyle } from './buttonStyles';

export default function VerifyDelivery() {
  const [reqUserNumber, setReqUserNumber] = useState(null);
  const [otp, setOtp] = useState(null);

  const handleSubmitOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost/nodesdeliveries-backend/shoper-api.php',
        {
          action: 'updateOrderIsDelivered',
          reqUserNumber: reqUserNumber,
          eneteredDeliveryCode: otp,
        }
      );

      if (response.data.statusDeliveryCode) {
        alert('OTP Is Successfully VERIFIED');
      } else {
        alert('OTP Or Phone No. Is Invalid, Please Try Again');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (event) => {
    setReqUserNumber(event.target.value);
  };

  const handleChange1 = (event) => {
    setOtp(event.target.value);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
      <Form onSubmit={handleSubmitOTP}>
        <Form.Group className="mb-3" controlId="formReqUserNum">
          <Form.Label>Requesting User Phone No:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter phone number"
            value={reqUserNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formOTP">
          <Form.Label>Delivery OTP:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleChange1}
            required
          />
        </Form.Group>

        <Button type="submit" style={buttonStyle}>
          Verify OTP
        </Button>
      </Form>
    </Col>
    </Row>
  </Container>
  );
}
