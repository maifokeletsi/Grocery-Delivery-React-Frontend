import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ListGroup, Button } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { PencilSquare, Trash, CheckLg } from 'react-bootstrap-icons';
const GroceryItem = ({ item, index, moveItem, handleDelete, updateOrder, theOrderCode }) => {
  const [, ref] = useDrag({
    type: 'GROCERY_ITEM',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'GROCERY_ITEM',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    drop: () => {
      // Call the updateOrder function when the drag ends
      updateOrder();
    },
  });

  return (
    <ListGroup.Item ref={(node) => drop(ref(node))} className="border mb-2 p-3">
      <p className="mb-1"><strong>Drag To Change Hierarchy</strong></p>
      <p className="mb-1">
        <strong>Shopping Item Hierarchy:</strong> {index + 1} <br />
        <strong>Grocery Item:</strong> {item.groceryItem} <br />
        <strong>Brand:</strong> {item.itemBrand} <br />
        <strong>Size:</strong> {item.itemSize} <br />
        <strong>Number of Items:</strong> {item.numOfItems}
      </p>

      <div className="btn-group" role="group">
        <Link to={`/edit/${item.itemId}/${theOrderCode}`} className="btn btn-info mr-2">
          <PencilSquare size={20} /> Edit
        </Link>
        <Button variant="danger" onClick={() => handleDelete(item.itemId, item.orderCode)}>
          <Trash size={20} /> Delete
        </Button>
      </div>
    </ListGroup.Item>
  );
};

const GroceryItemsList = ({ theOrderCode }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data.length === 2) {
      alert("CLICK AND DRAG to arrange items by priority.\n" +
        "Since they will be shopped based on hierarchy number just in case funds not enough for all items.");
    }
    fetchAllHierachyOrderedItems(theOrderCode);
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

  const fetchAllOrderedItems = async (orderCode) => {
    try {
      const response = await axios.get('http://localhost/nodesdeliveries-backend/grocerycontr-api.php', {
        params: {
          action: 'list',
          theOrderCode: orderCode,
        },
      });

      setData(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (itemId, orderCode) => {
    try {
      await axios.post('http://localhost/nodesdeliveries-backend/grocerycontr-api.php', {
        action: 'delete',
        itemId,
        theOrderCode: orderCode,
      });

      fetchAllOrderedItems(orderCode);
    } catch (error) {
      setError(error.message);
    }
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedData = [...data];
    const [movedItem] = updatedData.splice(fromIndex, 1);
    updatedData.splice(toIndex, 0, movedItem);
    setData(updatedData);
  };

  const updateOrder = async () => {
    try {
      await axios.post('http://localhost/nodesdeliveries-backend/grocerycontr-api.php', {
        action: 'updateOrder',
       theOrderCode: theOrderCode,
        updatedData: data.map((item, index) => ({ itemId: item.itemId, newOrder: index + 1 })),
      });

      // Optionally, you can refetch the data after updating the order
     // fetchAllOrderedItems(theOrderCode);
     // THIST METHOD DOES NOT EXIST IT IS TO BE CREATED ---> fetchAllHierachyOrderedItems(theOrderCode);
     fetchAllHierachyOrderedItems(theOrderCode);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
       {data.length > 0 && (
        <DndProvider backend={HTML5Backend}>
          <div>
            <h2 className="mb-4">Grocery Items</h2>

            <div>
              <Link to={`/payTheOrder/${theOrderCode}`} className="btn btn-success mb-3">
                Place Order
              </Link>
              <br />
              <ListGroup>
                {Array.isArray(data) &&
                  data.map((item, index) => (
                    <GroceryItem
                      key={item.itemId}
                      item={item}
                      index={index}
                      moveItem={moveItem}
                      handleDelete={handleDelete}
                      updateOrder={updateOrder}
                      theOrderCode={theOrderCode}
                    />
                  ))}
              </ListGroup>

              {error && (
                <div className="alert alert-danger mt-3">
                  <h2>Error:</h2>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        </DndProvider>
      )}

      {data.length === 0 && (
        <Alert variant="info">There are no items added. Add Items to view them</Alert>
      )}
    </>
  );
};

export default GroceryItemsList;