import React, { useState } from "react";
// import { resizeImage } from "../../../utils/resizeImage";
import { currencyFormat } from "../../../utils/number";
// import ConfirmModal from "../../../common/component/ConfirmModal";
import { useDispatch } from "react-redux";
import {
  getProductList,
  saleProduct,
} from "../../../features/product/productSlice";

function SaleForm({ openSaleForm,  setOpenSaleForm, page, name, handleClose, setSuccess  }) {
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

    await dispatch(saleProduct({ id: item._id, sale }));
    dispatch(getProductList({ page, name }));
    setOpenSaleForm({ open: false });

    handleClose();

  }
  return (
    <dialog open={openSaleForm.open} className="sale-dialog">
      <div className="sale">
        <div className="sale__target">
          <div className="img-box">
            {/* <img src={resizeImage(item.image[0].url, 200)} alt={item.name} /> */}
            <img src={item.image} alt={item.name} />
          </div>
          <div className="sale__property">
            <div>{item.name}</div>
            <div>${item.price}</div>
            <label>
              Sale:{" "}
              <input
                type="number"
                placeholder="0"
                value={sale}
                onChange={(e) => setSale(e.target.value)}
                max={100}
                min={0}
                step={1}
              />
              %
            </label>
            <div>
              Result: ₩
              <strong>
                {currencyFormat(item.price - (item.price * sale) / 100)}
              </strong>
            </div>
          </div>
        </div>
        <div className="sale__btn-box">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={() => setOpenSaleForm({ open: false })}>
            Close
          </button>
        </div>
      </div>
      {/* {confirmOption.open && (
        <ConfirmModal
          setConfirmOption={setConfirmOption}
          confirmOption={confirmOption}
        />
      )} */}
    </dialog>
  );
}

export default SaleForm;