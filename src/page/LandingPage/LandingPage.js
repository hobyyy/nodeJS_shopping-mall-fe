import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

const LandingPage = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get("name");
  // const loading = useSelector((state) => state.product.loading); // 로딩 상태 가져오기
  const loading = false;
  useEffect(() => {
    dispatch(
      getProductList({
        name,
      })
    );
  }, [name, dispatch]);
  // console.log('name',name);
  return (
    <Container>
      <Row>
        {loading ? (
          // 로딩 중일 때 Skeleton 컴포넌트 표시
          Array.from({ length: 8 }).map((_, index) => (
            <Col md={3} sm={12} key={index}>
              <ProductCard item={null} loading={true} /> {/* 로딩 prop 추가 */}
            </Col>
          ))
        ) : productList.length > 0? (
          productList.map((item) => (
            <Col xs={12} sm={6} md={4} lg={3} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          // 상품이 없을 때의 메시지
          name && ( // name이 존재할 때만 메시지를 보여줍니다
            <div className="text-align-center empty-bag">
              <h1>"{name}"에 대한 결과를 찾을 수 없습니다.</h1>
              <p>다른 단어를 사용하여 다시 시도하세요.</p>
            </div>
          )
          // <div className="text-align-center empty-bag">
          //   {name === "" ? (
          //     <h2>등록된 상품이 없습니다!</h2>
          //   ) : (
          //     <div>
          //       <h1>"{name}"에 대한 결과를 찾을 수 없습니다.</h1>
          //       <p>다른 단어를 사용하여 다시 시도하세요.</p>
          //     </div>  
          //   )}
          // </div>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
