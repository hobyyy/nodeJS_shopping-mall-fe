import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { currencyFormat } from "../../../utils/number";
import Skeleton from "react-loading-skeleton"; // Skeleton 임포트
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton 스타일 임포트
import { useSelector } from "react-redux"; // useSelector 임포트

const ProductTable = ({ header = [], data = [], deleteItem, openEditForm, searchKeyword, setOpenSaleForm }) => {
  const loading = useSelector((state) => state.product.loading); // Redux store에서 로딩 상태 가져오기
  
  return (
    <div className="overflow-x">
      {loading ? (
        // 로딩 중일 때 스켈레톤 표시
        <Table striped bordered hover>
          <thead>
            <tr>
              {header.map((title, index) => (
                <th key={index}>
                  <Skeleton width={100} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => ( // 스켈레톤을 위한 더미 행 생성
              <tr key={index}>
                <th><Skeleton width={30} /></th>
                <th><Skeleton width={100} /></th>
                <th><Skeleton width={150} /></th>
                <th><Skeleton width={80} /></th>
                <th>
                  <Skeleton width={80} />
                  <Skeleton width={80} />
                </th>
                <th><Skeleton height={100} width={100} /></th>
                <th><Skeleton width={50} /></th>
                <th>
                  <Skeleton width={60} />
                  <Skeleton width={60} />
                </th>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : data.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              {header.map((title, index) => (
                <th key={index}>{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <th>{item.sku}</th>
                <th style={{ minWidth: "100px" }}>{item.name}</th>
                <th>{currencyFormat(item.price)}</th>
                <th>
                    {item.sale !== 0 && (
                      <div className="slaed-text">{item.sale}%</div>
                    )}
                  </th>
                <th>
                  {Object.keys(item.stock).map((size, index) => (
                    <div key={index}>
                      {size}: {item.stock[size]}
                    </div>
                  ))}
                </th>
                <th>
                  <img src={item.image} width={100} alt="product" />
                </th>
                <th>{item.status}</th>
                <th style={{ minWidth: "100px" }}>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteItem(item._id)}
                    className="mr-1"
                  >
                    Del
                  </Button>
                  <Button
                    size="sm" 
                    onClick={() => openEditForm(item)}
                    className="mr-1"
                  >
                    Edit
                  </Button>
                  <Button size="sm" onClick={() => setOpenSaleForm({ open: true, item })} variant="warning">
                    Sale
                  </Button>
                </th>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        // 데이터가 없을 경우 메시지 표시 (로딩이 아닐 때만)
        <div>
          <h1>"{searchKeyword}"에 대한 결과를 찾을 수 없습니다.</h1>
          <p>다른 단어를 사용하여 다시 시도하세요.</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
