import React from "react";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const price = item.productId.price * (1 - item.productId.sale / 100);

  const handleQtyChange = (id, value) => {
    dispatch(updateQty({ id, value }));
  };

  const deleteCart = (id) => {
    dispatch(deleteCartItem(id));
  };

  return (
    <div className="product-card-cart">
      <Row>
        <Col xl={2} l={3} md={3} xs={3}>
          <img src={item.productId.image} width={112} alt="product" />
        </Col>
        <Col xl={10} l={9} md={9} xs={9}>
          <div className="display-flex space-between">
            <strong className="mobile-font-size-s">{item.productId.name}</strong>
            <button className="trash-button">
              <FontAwesomeIcon
                icon={faTrashAlt}
                width={24}
                onClick={() => deleteCart(item._id)}
              />
            </button>
          </div>

          <div className={`${item.sale !== 0 && "sale__org-price"}`}>
            ₩ <span>{currencyFormat(item.productId.price)}</span>
            {item.productId.sale !== 0 && (
              <div className="sale__org-price__line-cart"></div>
            )}
            {item.productId.sale !== 0 && (
              <>
                <div className="slaed-text">
                  {item.productId.sale}% OFF
                </div>
                <div className="sale__price__applied">
                  ₩ <span>{currencyFormat(price)}</span>
                </div>
              </>
            )}
          </div>

          <div className="product-card-cart-info"> 
            <div>
              <div className="mobile-font-size-xs">Size: {item.size}</div>
              <div className="mobile-font-size-xs">
                {/* Total: ₩ {currencyFormat(item.productId.price * item.qty)} */}
                Total: ₩ {currencyFormat(price * item.qty)}
              </div>
            </div>
            <div>
              <Form.Select
                onChange={(event) =>
                  handleQtyChange(item._id, event.target.value)
                }
                required
                defaultValue={item.qty}
                className="qty-dropdown"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
              </Form.Select>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
