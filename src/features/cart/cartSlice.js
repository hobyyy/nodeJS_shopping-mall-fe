import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/cart',{productId: id, size, qty:1});  // qty :몇개 살건지
      if(response.status !== 200) throw new Error(response.error);
      else dispatch(showToastMessage({message: '카트에 아이템을 추가했습니다!', status: 'success'}));
      return response.data; // TODO
    }catch(error) {
      console.log('error',error);
      dispatch(showToastMessage({message: error.error, status: 'error'}));
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/cart');
      console.log('res',response);
      if(response.status !== 200) throw new Error(response.error);
      else return response.data.data;
    }catch(error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${id}`);
      if(response.status !== 200) throw new Error('Failed to delete item');
      else {
        dispatch(getCartList());  // 장바구니 목록 업데이트
        return response.data.data;
      }
    } catch (error) {
      dispatch(showToastMessage({ message: error.error || "카트에서 아이템을 삭제하는데 실패했습니다!", status: "error" }));
      return rejectWithValue(error.error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {}
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {}
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state)=> {
      state.loading = true;
      state.error = '';
    })
    .addCase(addToCart.fulfilled, (state,action)=> {
      state.loading = false;
      state.error = '';
      state.cartItemCount = action.payload.cartItemQty;
    })
    .addCase(addToCart.rejected, (state,action)=> {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(getCartList.pending, (state)=> {
      state.loading = true;
      state.error = '';
    })
    .addCase(getCartList.fulfilled, (state,action)=> {
      state.loading = false;
      state.error = '';
      state.cartList = action.payload;
      state.cartItemCount = action.payload.cartItemQty;
      state.totalPrice = action.payload.reduce((total,item) => total + item.productId.price*item.qty, 0);
    })
    .addCase(getCartList.rejected, (state,action)=> {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(deleteCartItem.pending, (state)=> {
      state.loading = true;
      state.error = '';
    })
    .addCase(deleteCartItem.fulfilled, (state,action)=> {
      state.loading = false;
      state.error = '';
      state.cartList = action.payload;
      state.cartItemCount = action.payload.cartItemQty;
      state.totalPrice = action.payload.reduce((total,item) => total + item.productId.price*item.qty, 0);
    })
    .addCase(deleteCartItem.rejected, (state,action)=> {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
