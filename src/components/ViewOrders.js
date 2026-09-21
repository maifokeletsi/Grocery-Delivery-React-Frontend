// src/components/GroceryOrders.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch data from the PHP backend when the component mounts
        axios.get('http://localhost/nodesdeliveries-backend/GetOrders.php')
            .then(response => {
                //  const parsedData =  JSON.parse(response.data);
                setOrders(response.data);
                console.log("DiOrder-->: " + orders);
                console.log("DiOrder: " + response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Grocery Carts</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.username}>
                        <strong>Username:</strong> {order.username}<br />
                        <strong>Items:</strong>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    <strong>Grocery Item:</strong> {item.groceryItem}<br />
                                    <strong>Item Brand:</strong> {item.itemBrand}<br />
                                    <strong>Item Size:</strong> {item.itemSize}<br />
                                    <strong>Number of Items:</strong> {item.numOfItems}<br />
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul> 
        </div>
    );
}

export default ViewOrders;
