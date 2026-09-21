import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    Row,
    Col,
    Spinner,
    Alert,
    Badge,
    Button,
    Form
} from "react-bootstrap";

function FetchProducts({ theOrderCode }) {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantities, setQuantities] = useState({});
    const [addingId, setAddingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {

        try {

            const response = await axios.get(
                "http://localhost:3001/FetchProducts"
            );

            setProducts(response.data);

        } catch (err) {

            setError("Unable to fetch products.");

        } finally {

            setLoading(false);

        }

    };

    const handleQuantityChange = (productId, value) => {
        setQuantities((prev) => ({ ...prev, [productId]: value }));
    };

    const handleAddToOrder = async (product) => {
        const qty = parseInt(quantities[product.id]) || 1;
        setAddingId(product.id);
        try {

            await axios.post("http://localhost/nodesdeliveries-backend/grocerycontr-api.php", {
                action: "add",
                groceryItem: product.name,
                itemBrand: product.brand || "",
                itemSize: product.size,
                numOfItems: qty,
                orderCode: theOrderCode,
            });
            alert(`${product.name.split(/\d/)[0].trim()} added to your order!`);
            setQuantities((prev) => ({ ...prev, [product.id]: "" }));
        } catch (err) {
            setError("Unable to add item to order.");
        } finally {
            setAddingId(null);
        }
    };

    if (loading) {

        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="success" />
                <h5 className="mt-3">Loading Products...</h5>
            </div>
        );

    }

    return (

        <div className="container mt-4">

            <h2 className="text-center mb-4">
                Grocery Items Available
            </h2>

            {error !== "" &&
                <Alert variant="danger">
                    {error}
                </Alert>
            }

            <Row>

                {products.length > 0 ?

                    products.map((product) => (

                        <Col
                            lg={4}
                            md={6}
                            sm={12}
                            key={product.id}
                            className="mb-4"
                        >

                            <Card className="shadow h-100">

                                <Card.Body>

                                    <Card.Title>

                                        {product.name.split(/\d/)[0].trim()}

                                    </Card.Title>

                                    <Card.Text>

                                        <strong>Price:</strong>

                                        <Badge
                                            bg="success"
                                            className="ms-2"
                                        >

                                            R {product.price}

                                        </Badge>

                                    </Card.Text>

                                    <Card.Text>

                                        <strong>Size:</strong>

                                        {" "}

                                        {product.size}

                                    </Card.Text>

                                    <Form.Group className="mb-2">
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            placeholder="Quantity"
                                            value={quantities[product.id] || ""}
                                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="success"
                                        disabled={addingId === product.id}
                                        onClick={() => handleAddToOrder(product)}
                                    >
                                        {addingId === product.id ? "Adding..." : "Add To Cart"}
                                    </Button>

                                </Card.Body>

                            </Card>

                        </Col>

                    ))

                    :

                    <Alert variant="warning">

                        No Products Found

                    </Alert>

                }

            </Row>

        </div>

    );

}

export default FetchProducts;