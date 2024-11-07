import React, { useState } from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrderList } from "../../features/order/orderSlice";
import ReactPaginate from "react-paginate";

const MyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderList, totalPageNum } = useSelector((state) => state.order);
  const [query] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    orderNum: query.get("orderNum") || ""
  }); 

  console.log('searchQuery', searchQuery);

  useEffect(() => {
    dispatch(getOrderList({ ...searchQuery, url: '/order/me'}));
  }, [dispatch, query, searchQuery]);

  useEffect(() => {
    // 검색어나 페이지가 바뀌면 url바꿔주기 
    // (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴 => 이 쿼리값 맞춰서  상품리스트 가져오기)
    if(searchQuery.orderNum === "") {
      delete searchQuery.orderNum;
    }
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();
    navigate('?' + queryString);
  }, [searchQuery]);

  const handlePageClick = ({ selected }) => {
    // 쿼리에 페이지값 바꿔주기
    setSearchQuery({...searchQuery, page: selected + 1})
  };

  if (orderList?.length === 0) {
    return (
      <Container className="no-order-box">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  }
  return (
    <Container className="status-card-container">
      {orderList.map((item) => (
        <OrderStatusCard
          orderItem={item}
          className="status-card-container"
          key={item._id}
        />
      ))}

      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPageNum}
        forcePage={searchQuery.page - 1}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        className="display-center list-style-none"
      />
    </Container>
  );
};

export default MyPage;
