import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import Skeleton from "react-loading-skeleton";
import { resizeImage } from "../../../utils/resizeImg";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCard = ({ item }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (item) {
      setLoading(false);
    }
  }, [item]);

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const smWidth = 200;
  const lgWidth = 300;
  const mobileImg = item?.image ? resizeImage(item.image, smWidth) : '';
  const desktopImg = item?.image ? resizeImage(item.image, lgWidth) : '';
  
  // 이미지 element의 옵션
  const Img = {
    src: mobileImg,
    srcSet: `${mobileImg} ${smWidth}w, ${desktopImg} ${lgWidth}w`,
    sizes: `(max-width: 400px) ${smWidth}px, ${lgWidth}px`,
    alt: "img",
  };

  return (
    <div className="card" onClick={() => showProduct(item._id)}>
      {loading ? (
        <>
          {/* Skeleton placeholders while loading */}
          <Skeleton height={150} /> {/* Image placeholder */}
          <Skeleton height={20} width="80%" style={{ marginTop: "10px" }} /> {/* Name placeholder */}
          <Skeleton height={20} width="60%" /> {/* Price placeholder */}
        </>
      ) : (
        <>
          {/* Actual content after loading */}
          <div className="card__img">
            {/* <img {...Img} /> */}
          </div>
          <img src={item?.image} alt={item?.name} />
          <div>{item?.name}</div>
          <div className="card__info__price">
            <div className={`${item.sale !== 0 && "sale__org-price"}`}>
              ₩ <span>{currencyFormat(item?.price)}</span>
              {item.sale !== 0 && <div className="sale__org-price__line"></div>}
            </div>
            {item.sale !== 0 && (
              <div className="sale__price-box">
                <div className="sale__price__applied">
                  ₩ <span>{currencyFormat(item?.price * (100 - item.sale) / 100)}</span>
                </div>
                <div className="slaed-text">{item.sale}% off</div>
              </div>
            )}
          </div>   
        </>
      )}
    </div>
  );
};

export default ProductCard;
