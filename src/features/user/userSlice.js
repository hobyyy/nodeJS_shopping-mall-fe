// redux toolkit으로 api 호출
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",  // action name
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/login', {email,password});
      // 성공
      // Loginpage에서 처리
      return response.data;
    }catch(error) {
      console.log('error',error);
      // 실패
      // 실패시 생긴 에러값을 reducer에 저장
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue } // thunk에서 쓸 필요한 함수들 정의
  ) => {
    // async함수이므로 try-catch문 사용
    try {
      const response = await api.post('/user',{email,name,password})
      // success
      // 1. 성공 토스트 메세지 보여주기
      // dispatch : action 호출하는 함수
      dispatch(showToastMessage({message:'회원가입을 성공했습니다.', status:'sucess'}))
      // 2. 로그인 페이지로 리다이렉트
      navigate('/login')
      return response.data.data;
    }catch(error){
      // fail
      // 1. 실패 토스트 메세지 출력
      dispatch(showToastMessage({message:'회원가입을 실패했습니다.', status:'error'}))
      // 2. 에러값을 저장한다
      // 벡엔드에서 error.message이기 때문에 error.error로 메세지를 보냄
      return rejectWithValue(error.error)
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {}
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,  // error값 저장
    success: false,
  },
  // 직접적으로 아이템을 호출할 때
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  // 외부의 함수를 통해서 호출이 될 때 ex)async
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {  // loading 중
      state.loading = true;
    })
    .addCase(registerUser.fulfilled, (state) => { // 정상적인 값을 받았을 때
      state.loading = false;
      state.registrationError = null;
    })
    .addCase(registerUser.rejected, (state,action) => {  // error가 났을 때
      state.registrationError = action.payload
    })
    .addCase(loginWithEmail.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginWithEmail.fulfilled, (state,action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.loginError = null;
    })
    .addCase(loginWithEmail.rejected, (state,action) => {
      state.loading = false;
      state.loginError = action.payload;
    })
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
