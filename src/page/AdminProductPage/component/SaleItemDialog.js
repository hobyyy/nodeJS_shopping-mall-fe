import React, { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { resizeImage } from "../../../utils/resizeImg";
import { currencyFormat } from "../../../utils/number";
// import ConfirmModal from "../../../common/component/ConfirmModal";
import { useDispatch } from "react-redux";
import {
  getProductList,
  saleProduct,
} from "../../../features/product/productSlice";
import '../style/adminProduct.style.css';

function SaleItemDialog({ openSaleForm,  setOpenSaleForm, page, name, handleClose, setSuccess  }) {
  const dispatch = useDispatch();
  const success = useState(false);
  // const [confirmOption, setConfirmOption] = useState({
  //   open: false,
  //   isWarning: false,
  //   message: "Would you like to upload this item?",
  //   cb: () => {},
  // });

  const [sale, setSale] = useState(0);
  const { item } = openSaleForm;
  if (sale > 100) {
    setSale(100);
  } else if (sale < 0) {
    setSale(0);
  }

  // function confirmSubmit() {
  //   // setConfirmOption({
  //   //   open: true,
  //   //   isWarning: false,
  //   //   message: "Would you like to update sale?",
  //   //   cb: handleSubmit,
  //   // });

  // }


  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log('sale',sale);
    if(sale===0) {
      return handleClose();
    }
    await dispatch(saleProduct({ id: item._id, sale }));
    dispatch(getProductList({ page, name }));
    setOpenSaleForm({ open: false });

    handleClose();

  }
  return (
    <Modal show={openSaleForm.open} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sale Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="sale__target">
          <div className="img-box mb-3">
            <img
              src={resizeImage(item.image, 200)}
              alt={item.name}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div className="sale__property">
            <h5>{item.name}</h5>
            <p>Price: ${currencyFormat(item.price)}</p>
            <Form.Group className="mb-3">
              <Form.Label>Sale Percentage:</Form.Label>
              <Form.Control
                type="number"
                value={sale}
                onChange={(e) => setSale(e.target.value)}
                placeholder="0"
                max={100}
                min={0}
                step={1}
              />
            </Form.Group>
            <div>
              Result: ₩
              <strong>
                {currencyFormat(item.price - (item.price * sale) / 100)}
              </strong>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SaleItemDialog;