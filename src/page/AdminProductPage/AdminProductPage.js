import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SearchBox from "../../common/component/SearchBox";
import NewItemDialog from "./component/NewItemDialog";
import ProductTable from "./component/ProductTable";
import {
  getProductList,
  deleteProduct,
  setSelectedProduct,
} from "../../features/product/productSlice";

const AdminProductPage = () => {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { productList, totalPageNum } = useSelector((state) => state.product);
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체

  // newItem을 추가하는 다이얼로그인지 / 기존의 Item을 수정하는 다이얼로그인지 구분값
  const [mode, setMode] = useState("new");  

  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];

  // 상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(() => {
    dispatch(getProductList({...searchQuery}));
  }, [query])

  // success 값이 변경될 때마다 페이지를 새로 고침합니다.
  useEffect(async() => {
    if (success) {
      dispatch(getProductList()); // 페이지 새로 고침
      setSuccess(false); // success 값을 초기화
    }
  }, [success]);

  useEffect(() => {
    // 검색어나 페이지가 바뀌면 url바꿔주기 
    // (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴 => 이 쿼리값 맞춰서  상품리스트 가져오기)
    if(searchQuery.name === "") {
      delete searchQuery.name;
    }else {
      // searchQuery객체를 쿼리형태로 만들어줌
      const params = new URLSearchParams(searchQuery);
      const query = params.toString();
      navigate('?' + query);
    }
  }, [searchQuery]);

  const deleteItem = (id) => {
    // 아이템 삭제하기
  };

  const openEditForm = (product) => {
    // edit모드로 설정하고
    // 아이템 수정다이얼로그 열어주기
    setShowDialog('true');
  };

  const handleClickNewItem = () => {
    // new 모드로 설정하고
    setMode('new');
    // 다이얼로그 열어주기
    setShowDialog('true');
  };

  const handlePageClick = ({ selected }) => {
    // 쿼리에 페이지값 바꿔주기
    setSearchQuery({...searchQuery, page: selected + 1})
  };

  // searchbox에서 검색어를 읽어온다 
  // =>  엔터를 치면 : onCheckEnter
  // => searchQuery객체가 업데이트 됌
  // => searchQuery 객체 안에 아이템 기준으로 url을 새로 생성해서 호출 &name=스트레이트+팬츠
  // => url 쿼리 읽어오기
  // => url 쿼리 기준으로 BE에 검색조건과 함께 호출한다
  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>

        <ProductTable
          searchKeyword={searchQuery.name}
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
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

      {/* Dialog */}
      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        setSuccess={setSuccess}
      />
    </div>
  );
};

export default AdminProductPage;
