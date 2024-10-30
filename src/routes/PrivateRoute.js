import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { loginWithToken } from "../../src/features/user/userSlice"; // 예시: user 정보 갱신 액션

const PrivateRoute = ({ permissionLevel }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!user) {
        const result = await dispatch(loginWithToken());
        if (loginWithToken.fulfilled.match(result)) {
          // 사용자 정보가 성공적으로 로드됨
          setIsAuthenticated(result.payload.user.level === permissionLevel || result.payload.user.level === "admin");
        } else {
          // 로그인 실패 시
          setIsAuthenticated(false);
        }
      } else {
        // 이미 로그인된 경우
        setIsAuthenticated(user.level === permissionLevel || user.level === "admin");
      }
      setLoading(false); // 로딩 상태 종료
    };

    checkAuthentication();
  }, [dispatch, user, permissionLevel]);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 UI 처리
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
