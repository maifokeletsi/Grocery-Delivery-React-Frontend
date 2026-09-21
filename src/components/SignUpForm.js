import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { buttonStyle } from './buttonStyles';

const SignUpForm = ({ orderIsPayed, orderIsAccepted, orderIsDelivered, displayOrderToPublic }) => {
  const { theOrderCode } = useParams();
  const navigate = useNavigate();
  const [parameter1, setParameter1] = useState(0); // State to control navigation
  const [parameter2, setParameter2] = useState(theOrderCode);
  const [isFormFilled, setIsFormFilled] = useState(false);

  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nameOfUser: '',
    reqUserNumber: '',
    password: '',
    password1: '',
    orderCode: theOrderCode,
    dueAmt: '',
    isPayed: orderIsPayed,
    orderIsAccepted: orderIsAccepted,
    orderIsDelivered: orderIsDelivered,
    displayOrderToPublic: displayOrderToPublic,
    securityQuestion: '',
    securityAnswer: '',
    address: '',
    deliveryVerificationCode: '' + Math.floor(1000 + Math.random() * 9000),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    //CHECK IF PASSWORD MATCHING WHILE TYPING
    if (formData.password1.length >= formData.password.length) {
      if (formData.password.length === 0 && formData.password1.length > formData.password.length) {
        alert('Enter the "PASSWORD FIELD" first then "CONFIRM PASSWORD FIELD"');
        setFormData({
          nameOfUser: formData.nameOfUser,
          reqUserNumber: formData.reqUserNumber,
          password: '',
          password1: '',
          orderCode: theOrderCode,
          dueAmt: formData.dueAmt,
          isPayed: orderIsPayed,
          orderIsAccepted: formData.orderIsAccepted,
          orderIsDelivered: formData.orderIsDelivered,
          displayOrderToPublic: formData.displayOrderToPublic,
          securityQuestion: formData.securityQuestion,
          securityAnswer: formData.securityAnswer,
          address: formData.address,
          deliveryVerificationCode: formData.deliveryVerificationCode,
        });
      } else {
        if (
          (name === 'password1' && value !== formData.password) ||
          formData.password1 !== formData.password
        ) {
          alert('Passwords do not match');
          setFormData({
            nameOfUser: formData.nameOfUser,
            reqUserNumber: formData.reqUserNumber,
            password: '',
            password1: '',
            orderCode: theOrderCode,
            dueAmt: formData.dueAmt,
            isPayed: orderIsPayed,
            orderIsAccepted: formData.orderIsAccepted,
            orderIsDelivered: formData.orderIsDelivered,
            displayOrderToPublic: formData.displayOrderToPublic,
            securityQuestion: formData.securityQuestion,
            securityAnswer: formData.securityAnswer,
            address: formData.address,
            deliveryVerificationCode: formData.deliveryVerificationCode,
          });
        }
      }
    }
  };

  const handleDropdownChange1 = (event) => {
    const value = event.target.value;

    // Update the state with the selected value
    setFormData((prevObject) => ({
      ...prevObject,
      securityQuestion: value,
    }));
  };

  const handleParameter1 = (amt) => {
    setParameter1(amt);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setFormData((prevData) => ({ ...prevData, address }));
        } catch {
          setFormData((prevData) => ({
            ...prevData,
            address: `${latitude}, ${longitude}`,
          }));
        }
      },
      () => {
        alert('Unable to retrieve your location');
      }
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost/nodesdeliveries-backend/req-user-api.php', {
        action: 'addUser',
        ...formData,
      });
    } catch (error) {
      setError('Error:', error);
    }
  };

  const handleNavigate = () => {
    if (
      formData.nameOfUser &&
      formData.reqUserNumber &&
      formData.password &&
      formData.password1 &&
      formData.dueAmt > 0 &&
      formData.orderCode &&
      formData.securityQuestion &&
      formData.securityAnswer &&
      formData.address &&
      formData.deliveryVerificationCode &&
      formData.displayOrderToPublic
    ) {
      // Trigger form submission

      handleSubmit();
      alert(
        'Order Is Successfully Placed. NOTE that we will REFUND you if deposited funds exceeds the estimated cost'
      );

      window.location.href = `http://localhost/nodesdeliveries-backend/payment-api.php?param1=${formData.dueAmt}&param2=${parameter2}`;
    } else {
      // Conditions not fulfilled, show a warning or take appropriate action
      alert('Fill all fields');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Form>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="nameOfUser">
              <Form.Label>Enter Your Name:</Form.Label>
              <Form.Control
                type="text"
                name="nameOfUser"
                placeholder="Thabang"
                value={formData.nameOfUser}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="reqUserNumber">
              <Form.Label>Cellphone No:</Form.Label>
              <Form.Control
                type="text"
                name="reqUserNumber"
                placeholder="07XXXXXXXX"
                value={formData.reqUserNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Delivery Address / Current Location:</Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Enter your address or click the button below"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <Button
                onClick={handleGetCurrentLocation}
                style={{ ...buttonStyle, marginTop: '5px' }}
              >
                Use Current Location
              </Button>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="password1">
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type="password"
                name="password1"
                placeholder="Confirm New Password"
                value={formData.password1}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="dueAmt">
              <Form.Label>Enter Estimated Cost:</Form.Label>
              <Form.Control
                type="text"
                name="dueAmt"
                placeholder="100 - Numeric Value Only"
                value={formData.dueAmt}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="securityQuestion">
              <Form.Label>Select Security Question:</Form.Label>
              <Form.Control
                as="select"
                value={formData.securityQuestion}
                onChange={handleDropdownChange1}
                required
              >
                <option>Select Security Question</option>
                <option value="What is the name of the ex your still in love with?">
                  What is the name of the ex your still in love with?
                </option>
                <option value="What is the name of the city you were born at">
                  What is the name of the city you were born at
                </option>
                <option value="What is the name of the favourite movie/series?">
                  What is the name of the favourite movie/series?
                </option>
                <option value="What is the name of the favourite dish?">
                  What is the name of the favourite dish?
                </option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="securityAnswer">
              <Form.Label>Answer Security Question:</Form.Label>
              <Form.Control
                type="text"
                name="securityAnswer"
                placeholder="Enter Your For Security Question"
                value={formData.securityAnswer}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" style={{ display: 'none' }}></Button>
          </Form>
          <br />
          <Button onClick={handleNavigate} style={buttonStyle}>Pay</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpForm;
