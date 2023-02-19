import React from "react";
import { useEffect, useReducer } from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
//import data from "../data";

const reducer = (state, action) => {
  // action, durum  değiştiren eylemdir
  switch (action.type) {
    case "FETCH_REQUEST": // Getirme isteği
      return { ...state, loading: true }; // state değeri ve yüklemeyi güncelleme
    case "FETCH_SUCCESS": //Getirme başarılı ise
      return { ...state, products: action.payload, loading: false }; // state değeri ve güncelleme olan verilere eşit ürünler action'dan gelen veriler action.payload içindedir
    case "FETCH_FAIL": // Getirme başarısız olursa
      return { ...state, loading: false, error: action.payload }; // state değeri ve yüklemeyi false yaparız ardından error değerine içindeki hata mesajı ile action.payload yaparız
    default: // action.type değilse
      return state; // varsayılan durum bu üç değere eşit dönüş durum
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: "",
  });
  //const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured Products</h1> 
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product= {product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
