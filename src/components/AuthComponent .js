import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

const AuthComponent = ({ handleVariable1Change }) => {
  const [formData, setFormData] = useState({
    reqUserNumber: '',
    password: '',
  });

  const [securityQuestion_S, setSecurityQuestion_S] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState(null);
  const [rstPswdNumber, setRstPswdNumber] = useState(null);
  const [rstPswdForm, setRstForm] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChange1 = (event) => {
    // Update the state with the new value

    setRstPswdNumber(event.target.value);
  };

  const handleChange2 = (event) => {
    setSecurityAnswer(event.target.value);
  }

  const handleChange3 = (event) => {
    setNewPassword(event.target.value);
  }

  const displayRstPsswdForm = () => {
    // Update the state with the new value
    setRstForm(true);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost/nodesdeliveries-backend/login.php',
        {
          action: 'login',
          ...formData,
        }
      );

      if (response.data.status) {
        handleVariable1Change(response.data.orderCode.replace('\r\n', ''));
        alert('Successfully Loged In');
        navigate("/viewItems");
      } else {
        alert('Invalid Password Or Phone No. .');
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSecurityQuestion = async (reqUserNo) => {
    try {
      const response = await axios.get('http://localhost/nodesdeliveries-backend/req-user-api.php', {
        params: {
          action: 'getSecurityQuestion',
          reqUserNumber: reqUserNo,
        }
      });
      ;
      setSecurityQuestion_S(response.data.securityQuestion);

    } catch (error) {
      setSecurityQuestion_S(null);
      setError(error.message);
    }
  };


  const handleSubmit1 = async (e) => {
    e.preventDefault();

    fetchSecurityQuestion(rstPswdNumber);

  };

  const handleSubmit3 = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost/nodesdeliveries-backend/req-user-api.php',
        {
          action: 'updatePassword',
          securityAnswer_p: securityAnswer,
          newPassword_p: newPassword,
        }
      );
      if (response.data.trim() === 'Successfully Updated Password.') {
        alert(response.data.trim());
        navigate("/");
      } else {
        alert(response.data.trim());
      }

    } catch (error) {
      setError('Error:', error);
    }
  };

  const buttonStyle = {
    // Your button styles go here
    backgroundColor: '#4CAF50', // Green color (you can change it)
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  };

  const iconStyle = {
    marginRight: '8px', // Adjust the spacing between the icon and text
  };

  return (
    <Container>
    <Row>
      <Col>
        <h4>LogIn Credentials</h4>
        {(rstPswdForm === false) && (
          <div>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Cellphone No. :</Form.Label>
                <Form.Control
                  type="text"
                  name="reqUserNumber"
                  placeholder="Enter phone number"
                  value={formData.reqUserNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button type="submit" className="login-button">
                Log In
              </Button>
            </Form>
            <h5>
              <strong>Did You Forget Password?</strong>
            </h5>
            <Button onClick={displayRstPsswdForm} style={buttonStyle}>
              Reset Password Here
            </Button>
          </div>
        )}

        {rstPswdForm && (
          <Form onSubmit={handleSubmit1}>
            <Form.Group>
              <Form.Label>Cellphone No. :</Form.Label>
              <Form.Control
                type="text"
                name="rstPswdNumber"
                placeholder="Enter Cellphone No. Here"
                value={rstPswdNumber}
                onChange={handleChange1}
                required
              />
            </Form.Group>
            <Button type="submit">Submit</Button>
          </Form>
        )}

        {securityQuestion_S && rstPswdForm && (
          <Form onSubmit={handleSubmit3}>
            <Form.Group>
              <Form.Label>{securityQuestion_S}:</Form.Label>
              <Form.Control
                type="password"
                name="securityAnswer"
                placeholder="Answer Security Question Here"
                value={securityAnswer}
                onChange={handleChange2}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New Password:</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="Enter New Password Here"
                value={newPassword}
                onChange={handleChange3}
                required
              />
            </Form.Group>
            <Button type="submit" style={buttonStyle}>
              Update Password
            </Button>
          </Form>
        )}
      </Col>
    </Row>
  </Container>
  );
};

export default AuthComponent;
