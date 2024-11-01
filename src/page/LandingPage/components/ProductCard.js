import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCard = ({ item }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulating loading time; you can remove or adjust based on your data fetching logic
  useEffect(() => {
    // Assuming the item prop will be populated soon after
    if (item) {
      setLoading(false);
    }
  }, [item]);

  const showProduct = (id) => {
    navigate(`/product/${id}`);
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
          <img src={item?.image} alt={item?.name} />
          <div>{item?.name}</div>
          <div>₩ {currencyFormat(item?.price)}</div>
        </>
      )}
    </div>
  );
};

export default ProductCard;
