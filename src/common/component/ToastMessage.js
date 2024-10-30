import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  const { toastMessage } = useSelector((state) => state.ui);
  useEffect(() => {
    if (toastMessage) {
      const { message, status } = toastMessage;
      if (message !== "" && status !== "") {
        console.log('toast',toast);
        // toast 객체에 존재하는 메서드인지 확인
        if (typeof toast[status] === "function") {
          toast[status](message, { theme: "colored" });
        } else {
          // 기본 상태를 설정(예: "info")
          toast.info(message, { theme: "colored" });
        }
      }
    }
  }, [toastMessage]);
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ToastMessage;
