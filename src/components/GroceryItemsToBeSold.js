import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { buttonStyle, editButtonStyle, deleteButtonStyle } from './buttonStyles';

const GroceryItemsToBeSold = ({ theOrderCode }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {


    fetchAllOrderedItems(theOrderCode);
  }, [theOrderCode]);

  const fetchAllOrderedItems = async (theOrderCode) => {
    try {
      const response = await axios.get('http://localhost/groceydeliveryapp/grocerycontr-api.php', {
        params: {
          action: 'list',
          theOrderCode: theOrderCode,
        }
      });

      setData(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  



  const handleDelete = async (itemId, theOrderCode) => {
    try {
      const response = await axios.post('http://localhost/groceydeliveryapp/grocerycontr-api.php', {
        action: 'delete',
        itemId: itemId,
        theOrderCode: theOrderCode,
      });


      fetchAllOrderedItems(theOrderCode);
    } catch (error) {
      setError(error.message); // Callback to inform about deletion error
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>

          {(data.length > 0) && <div className="text-center">
            <h2 className="mb-4">Grocery Items</h2>

            <div>
              <Link to={`/payTheOrder/${theOrderCode}`}><button style={buttonStyle}>Place The Order</button></Link>
              <br />
              <ul className="list-unstyled mt-4">
                {Array.isArray(data) && data.map(item => (
                  <li key={item.itemId} className="mb-3">
                    <p>Grocery Item: {item.groceryItem} || Brand: {item.itemBrand} || Size: {item.itemSize} || Number of Items: {item.numOfItems}</p>

                    <Link to={`/edit/${item.itemId}/${theOrderCode}`}><button style={editButtonStyle}>Edit</button></Link>

                    <button onClick={() => handleDelete(item.itemId, item.orderCode)} style={deleteButtonStyle}>Delete</button>
                  </li>
                ))}
              </ul>

              {error && (
                <div>
                  <h2>Error:</h2>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
          }


          {(data.length === 0) &&
            <div className="text-center">
              <h4>There are no items added</h4>
              <h4>Add Items in order to view them</h4>
            </div>}
        </Col>
      </Row>
    </Container>
  );
};

export default GroceryItemsToBeSold;
