// redux toolkit으로 api 호출
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",  // action name
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // 성공
      // Loginpage에서 처리
      // token을 세션 스토리지에 저장
      const response = await api.post('auth/login', { email, password });
      sessionStorage.setItem('token', response.data.token);
      return response.data;  // 데이터를 리턴하여 리듀서로 전달
    } catch (error) {      
      // 실패 시 에러를 rejectWithValue로 전달
      return rejectWithValue(error?.error || 'Login failed');
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/google', {token});
      if(response.status !== 200) throw new Error(response.error);
      console.log('response',response)
      sessionStorage.setItem('token', response.data.token);
      return response.data.user;  // 데이터를 리턴하여 리듀서로 전달
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const logout = () => (dispatch) => {
  // 상태 초기화
  dispatch(clearUser());
};

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

// 웹페이지가 켜지자 마자 실행되는 함수
export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/me');
      return response.data;
    }catch(error) {
      return rejectWithValue(error.error);
    }
  }
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
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.loginError = null;
      state.registrationError = null;
      state.success = false;
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

    .addCase(loginWithGoogle.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginWithGoogle.fulfilled, (state,action) => {
      state.loading = false;
      state.user = action.payload;
      state.loginError = null;
    })
    .addCase(loginWithGoogle.rejected, (state,action) => {
      state.loading = false;
      state.loginError = action.payload;
    })

    .addCase(loginWithToken.fulfilled, (state,action) => {
      state.user = action.payload.user;
    })
  },
});

export const { clearErrors, clearUser } = userSlice.actions;
export default userSlice.reducer;
