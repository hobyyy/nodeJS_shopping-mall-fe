import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import { initialCart } from '../../features/cart/cartSlice';

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const [showSearchBox, setShowSearchBox] = useState(false);  
  const location = useLocation(); // 현재 페이지 경로 확인을 위해 사용
  const [keyword, setKeyword] = useState(""); // 검색어 상태 추가
  const menuList = [
    "여성",
    "Divided",
    "남성",
    "신생아/유아",
    "아동",
    "H&M HOME",
    "Sale",
    "지속가능성",
  ];
  let [width, setWidth] = useState(0);
  let navigate = useNavigate();
  // console.log('cartItemCount',cartItemCount);

  useEffect(() => {
    // 페이지 이동 시 검색어 초기화
    setKeyword("");
  }, [location.pathname]); // 경로가 바뀔 때마다 실행

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        // return navigate("/");
        return navigate(window.location.pathname);
      } else {
        const searchParam = window.location.pathname.includes("/order/me")
        ? `?orderNum=${event.target.value}` // 주문번호 검색 쿼리
        : `?name=${event.target.value}`;    // 제품명 검색 쿼리
        navigate(searchParam);
        setKeyword(""); // 페이지 이동 후 검색어 초기화
      }
    }
  };

  const handleLogout = () => {
    // 세션 스토리지에서 토큰 삭제
    sessionStorage.removeItem('token');
    // Redux 상태 초기화
    dispatch(logout());
    dispatch(initialCart()); // cartItemCount를 0으로 설정
    // 로그아웃 후 로그인 페이지로 redirect
    navigate('/login')
  };

  const searchPlaceholder = window.location.pathname.includes("/order/me")
  ? "주문번호 검색"
  : "제품이름 검색";

  return (
    <div>
      {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onKeyPress={onCheckEnter}
                value={keyword} // 검색어 상태 바인딩
                onChange={(e) => setKeyword(e.target.value)} // 검색어 업데이트
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>
      {user && user.level === "admin" && (
        <Link to="/admin/product?page=1" className="link-area">
          Admin page
        </Link>
      )}
      <div className="nav-header">
        <div className="burger-menu hide">
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>

        <div>
          <div className="display-flex">
            {user ? (
              <div onClick={handleLogout} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && (
                  <span style={{ cursor: "pointer" }}>로그아웃</span>
                )}
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
              </div>
            )}
            <div onClick={() => navigate("/cart")} className="nav-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                  cartItemCount || 0
                })`}</span>
              )}
            </div>
            <div
              onClick={() => navigate("/order/me")}
              className="nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
            </div>
            {isMobile && (
              <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                <FontAwesomeIcon icon={faSearch} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nav-logo">
        <Link to="/">
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </Link>
      </div>
      <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu, index) => (
            <li key={index}>
              <a href="#">{menu}</a>
            </li>
          ))}
        </ul>
        {!isMobile && ( // admin페이지에서 같은 search-box스타일을 쓰고있음 그래서 여기서 서치박스 안보이는것 처리를 해줌
          <div className="search-box landing-search-box ">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onKeyPress={onCheckEnter}
              value={keyword} // 검색어 상태 바인딩
              onChange={(e) => setKeyword(e.target.value)} // 검색어 업데이트
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
