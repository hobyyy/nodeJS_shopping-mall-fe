import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = (data, price) => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartList = data.data? data.data : data.cartList;
  const totalPrice = data.price? data.price : data.totalPrice;
  // console.log('cartlist',cartList);
  
  return (
    <div className="receipt-container">
      <h3 className="receipt-title">주문 내역</h3>
      <ul className="receipt-list">
         {cartList.length > 0 && 
          cartList.map((item,index) => (
            <li key={index}>
              <div className="display-flex space-between">
                <div>{item.productId.name} - {item.size} - {item.qty}개</div>
                <div className="display-flex">                  
                  {item.productId.sale? (
                    <>
                      <div className="sale-tag">SALE</div>
                      <div className="slaed-text-total">₩ {currencyFormat(item.productId.price * (1 - item.productId.sale / 100) * item.qty)}</div>
                    </>
                  ):(
                    <div>₩ {currencyFormat(item.productId.price * item.qty)}</div>
                  )}
                </div>
              </div>
            </li>
          ))} 
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>₩ {currencyFormat(totalPrice)}</strong>
        </div>
      </div>
      {location.pathname.includes("/cart") && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={() => navigate("/payment")}
        >
          결제 계속하기
        </Button>
      )}

      <div>
        가능한 결제 수단 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는
        확인되지 않습니다.
        <div>
          30일의 반품 가능 기간, 반품 수수료 및 미수취시 발생하는 추가 배송 요금
          읽어보기 반품 및 환불
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
