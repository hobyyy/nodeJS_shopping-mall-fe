import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { currencyFormat } from "../../../utils/number";

const ProductTable = ({ header = [], data = [], deleteItem, openEditForm, searchQuery }) => {
  return (
    <div className="overflow-x">
      {data.length > 0 ? (
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
                    <Button size="sm" onClick={() => openEditForm(item)}>
                      Edit
                    </Button>
                  </th>
                </tr>
              ))}
            </tbody>
          </Table>
      ) : (
        <div>
          <h1>"{searchQuery}"에 대한 결과를 찾을 수 없습니다.</h1>
          <p>다른 단어를 사용하여 다시 시도하세요.</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
