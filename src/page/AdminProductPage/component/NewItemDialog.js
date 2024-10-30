import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Modal, Button, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
import "../style/adminProduct.style.css";
import {
  clearError,
  createProduct,
  editProduct,
} from "../../../features/product/productSlice";

const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: "",
};

const NewItemDialog = ({ mode, showDialog, setShowDialog, setSuccess}) => {
  const { error, success, selectedProduct } = useSelector(
    (state) => state.product
  );
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedProduct
  );
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stocEmptykError, setStockEmptyError] = useState(false);
  const [stockNumError, setStockNumError] = useState(false);

  const navigate = useNavigate();
  // const location = useLocation();

  useEffect(() => {
    if (success) {                        // 상품 생성을 성공했으므로
      setShowDialog(false);               // dialog 닫기 
      // navigate("/admin/product?page=1");  // navigate를 사용해 페이지 이동(작동 안함 : 수정필요)
      setSuccess(true);
    }
  }, [success]);

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === "edit") {
        setFormData(selectedProduct);
        // 객체형태로 온 stock을  다시 배열로 세팅해주기
        const sizeArray = Object.keys(selectedProduct.stock).map((size) => [
          size,
          selectedProduct.stock[size],
        ]);
        setStock(sizeArray);
      } else {
        setFormData({ ...InitialFormData });
        setStock([]);
      }
    }
  }, [showDialog]);

  const handleClose = () => {
    // 모든걸 초기화시키고;
    setFormData({ ...InitialFormData });
    setStock([]);
    setStockEmptyError(false);
    setStockNumError(false);
    if (error) dispatch(clearError());
  
    // 다이얼로그 닫아주기
    setShowDialog(false);
  };
  
  // 상품 생성과 관련된 로직 함수
  const handleSubmit = (event) => {
    event.preventDefault();
    // 재고를 입력했는지 확인, 아니면 에러
    if(stock.length === 0) return setStockEmptyError(true);

    // 재고를 배열에서 객체로 바꿔주기
    // [['S',2], ['M',2]] 에서 {S:3, M:2}로
    const totalStock = stock.reduce((total,item) => {
      return {...total, [item[0]] : parseInt(item[1])}
    },{})
    if (mode === "new") {
      // 새 상품 만들기
      dispatch(createProduct({...formData, stock: totalStock}))
    } else {
      // 상품 수정하기
    }
  };

  const handleChange = (event) => {
    // form에 데이터 넣어주기
    const {id,value} = event.target;
    setFormData({...formData, [id]:value});
  };

  const addStock = () => {
    // 재고타입 추가시 배열에 새 배열 추가
    setStockEmptyError(false);
    setStockNumError(false);
    setStock([...stock,[]]);
  };

  const deleteStock = (index) => {
    // 재고 삭제하기
    // console.log('index',index);
    // const newStock = stock.filter((item,idx) => idx !== index);
    // setStock(newStock);
    setStock((prevStock) => prevStock.filter((_, idx) => idx !== index));
  };

  const handleSizeChange = (value, index) => {
    // 재고 사이즈 변환하기
    const newStock = [...stock];
    newStock[index][0] = value;
    setStock(newStock);
  };

  const handleStockChange = (value, index) => {
    // 재고 수량 변환하기
    const newStock = [...stock];
    newStock[index][1] = value;
    setStock(newStock);
  };

  const onHandleCategory = (event) => {
    // category가 이미 추가되어 있으면 제거
    if (formData.category.includes(event.target.value)) {
      const newCategory = formData.category.filter(
        (item) => item !== event.target.value
      );
      setFormData({
        ...formData,
        category: [...newCategory],
      });
    } else {
      // category가 이미 추가안되어 있으면 추가
      setFormData({
        ...formData,
        category: [...formData.category, event.target.value],
      });
    }
  };

  const uploadImage = (url) => {
    // 이미지 업로드
    setFormData({...formData, image : url})
  };

  // console.log('stock',stock);
  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        {mode === "new" ? (
          <Modal.Title>Create New Product</Modal.Title>
        ) : (
          <Modal.Title>Edit Product</Modal.Title>
        )}
      </Modal.Header>
      {error && (
        <div className="error-message">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="sku">
            <Form.Label>Sku</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Enter Sku"
              required
              value={formData.sku}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Name"
              required
              value={formData.name}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="string"
            placeholder="Description"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.description}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className="mr-1">Stock</Form.Label>
          {stocEmptykError && (
            <span className="error-message">재고를 추가해주세요!</span>
          )}
          {stockNumError && (
            <span className="error-message">양수를 입력해주세요!</span>
          )}
          <Button size="sm" onClick={addStock}>
            Add +
          </Button>
          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={item.id || index}>
                <Col sm={4}>
                  <Form.Select
                    onChange={(event) =>
                      handleSizeChange(event.target.value, index)
                    }
                    required
                    // defaultValue={item[0] ? item[0].toLowerCase() : ""}
                  >
                    <option value="" disabled selected hidden>
                      Please Choose...
                    </option>
                    {SIZE.map((item, index) => (
                      <option
                        inValid={true}
                        value={item.toLowerCase()}
                        disabled={stock.some(
                          (size) => size[0] === item.toLowerCase()
                        )}
                        key={index}
                      >
                        {item}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    onChange={(event) => {
                      const newValue = parseInt(event.target.value);
                      if(newValue > 0 || event.target.value === '') handleStockChange(event.target.value, index);
                      else return setStockNumError(true);
                    }
                    }
                    type="number"
                    placeholder="number of stock"
                    value={item[1] || ''} // item[1]이 undefined 일 때 빈문자열 할당
                    required
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteStock(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Image" required>
          <Form.Label>Image</Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />

          <img
            id="uploadedimage"
            src={formData.image}
            className="upload-image mt-2"
            alt="uploadedimage"
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={formData.price}
              required
              onChange={handleChange}
              type="number"
              placeholder="0"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              multiple
              onChange={onHandleCategory}
              value={formData.category}
              required
            >
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={handleChange}
              required
            >
              {STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        {mode === "new" ? (
          <Button variant="primary" type="submit">
            Submit
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Edit
          </Button>
        )}
      </Form>
    </Modal>
  );
};

export default NewItemDialog;
