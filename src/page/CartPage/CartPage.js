import React from "react";
import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { getCartList } from "../../features/cart/cartSlice";
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartList, totalPrice, loading } = useSelector((state) => state.cart);
  useEffect(() => {
    // 카트리스트 불러오기
    dispatch(getCartList())
  }, [dispatch]);

  return (
    <Container>
      <Row>
        <Col xs={12} md={7}>
          {loading ? (
            // Render skeleton loader while loading
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton-card">
                <Skeleton height={80} width={80} className="skeleton-thumbnail" />
                <div className="skeleton-content">
                  <Skeleton height={12} width="100%" />
                  <Skeleton height={12} width="100%" />
                  <Skeleton height={12} width="50%" />
                </div>
              </div>
            ))
          ) :cartList.length > 0 ? (
            cartList.map((item) => (
              <CartProductCard item={item} key={item._id} />
            ))
          ) : (
            <div className="text-align-center empty-bag">
              <h2>카트가 비어있습니다.</h2>
              <div>상품을 담아주세요!</div>
            </div>
          )}
        </Col>
        <Col xs={12} md={5}>
          {loading ? (
            <Skeleton height={460} className="skeleton-order-receipt" />
          ) : (
            <OrderReceipt data={cartList} price={totalPrice} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
