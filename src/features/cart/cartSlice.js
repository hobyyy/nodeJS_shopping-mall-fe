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
      dispatch(showToastMessage({message: '카트에 아이템을 추가했습니다!', status: 'success'}));
      return response.data; // TODO
    }catch(error) {
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
      return response.data.data;
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
      dispatch(getCartList());  // 장바구니 목록 업데이트
      return response.data.data;
    } catch (error) {
      dispatch(showToastMessage({ message: error.error || "카트에서 아이템을 삭제하는데 실패했습니다!", status: "error" }));
      return rejectWithValue(error.error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${id}`,{qty:value});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/cart/qty');
      return response.data.qty;
    } catch (error) {
      dispatch(showToastMessage({message: error, status: 'error'}));
      return rejectWithValue(error.error);
    }
  }
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
      
      // 쇼핑백 개수 계산
      state.cartItemCount = action.payload.data.items.reduce((total,item) => total + item.qty, 0);
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
      // state.cartItemCount = action.payload.cartItemQty;
      state.totalPrice = action.payload.data.items.reduce((total,item) => {
        const price = item.productId.price * (1 - item.productId.sale/100);
        return total + price*item.qty;
      }, 0);
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

      // totalPrice, 쇼핑백 개수 계산
      state.cartItemCount = action.payload.reduce((total,item) => total + item.qty, 0);
      state.totalPrice = action.payload.data.items.reduce((total,item) => {
        const price = item.productId.price * (1 - item.productId.sale/100);
        return total + price*item.qty;
      }, 0);
    })
    .addCase(deleteCartItem.rejected, (state,action)=> {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(updateQty.pending, (state) => {
      state.loading = true;
      state.error = '';
    })
    .addCase(updateQty.fulfilled, (state, action) => {  
      state.loading = false;
      state.error = '';
      state.cartList = action.payload;
      
      // totalPrice, 쇼핑백 개수 계산
      state.cartItemCount = action.payload.reduce((total,item) => total + item.qty, 0);
      state.totalPrice = action.payload.data.items.reduce((total,item) => {
        const price = item.productId.price * (1 - item.productId.sale/100);
        return total + price*item.qty;
      }, 0);
    })
    .addCase(updateQty.rejected, (state,action)=> {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(getCartQty.pending, (state) => {
      state.loading = true;
      state.error = '';
    })
    .addCase(getCartQty.fulfilled, (state, action) => {  
      state.loading = false;
      state.error = '';
      state.cartItemCount = action.payload;
    })
    .addCase(getCartQty.rejected, (state,action)=> {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
