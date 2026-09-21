import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

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
    <div>
      <h5>Verify Delivery Of Order Credentials</h5>
      <Form onSubmit={handleSubmitOTP}>
        <Form.Group controlId="formReqUserNum">
          <Form.Label>Requesting User Phone No:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter phone number"
            value={reqUserNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formOTP">
          <Form.Label>Delivery OTP:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleChange1}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Verify OTP
        </Button>
      </Form>
    </div>
  );
}
