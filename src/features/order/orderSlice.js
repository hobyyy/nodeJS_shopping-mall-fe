import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";
import { initialCart } from '../../features/cart/cartSlice';

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/order', payload);
      if(response.status !== 200) throw new Error(response.error);
      // dispatch(getCartQty())
      dispatch(initialCart());
      return response.data.orderNum;
    } catch (error) {
      dispatch(showToastMessage({message: error.message||'주문 생성에 실패했습니다.', status:'fail'}))
      return rejectWithValue(error.error);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {}
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async ({ url, ...query }, { rejectWithValue, dispatch }) => {
    try {
      console.log('url', url)
      console.log(`${url}`)
      const response = await api.get(`${url}`,{params: {...query}});
      if(response.status !== 200) throw new Error(response.error);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${id}`, {status});
      if(response.status !== 200) throw new Error(response.error);
      // dispatch({})
      console.log('response',response);

      dispatch(showToastMessage({message: '오더 상태 수정완료!', status:'success'}));
      dispatch(getOrderList());
      return response.data.data;
    } catch (error) {
      dispatch(showToastMessage({message: error.message||'오더 상태 수정에 실패했습니다.', status:'fail'}))
      return rejectWithValue(error.error);
    }

  }
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
    })
    .addCase(createOrder.fulfilled, (state,action) => {
      state.loading = false;
      state.error = '';
      state.orderNum = action.payload;
    })
    .addCase(createOrder.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    .addCase(getOrderList.pending, (state) => {
      state.loading = true;
    })
    .addCase(getOrderList.fulfilled, (state,action) => {
      state.loading = false;
      state.error = '';
      state.orderList = action.payload.data;
      state.totalPageNum = action.payload.totalPageNum;
    })
    .addCase(getOrderList.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(updateOrder.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateOrder.fulfilled, (state,action) => {
      state.loading = false;
      state.error = '';
      // state.orderList = action.payload.data;
      // state.totalPageNum = action.payload.totalPageNum;
    })
    .addCase(updateOrder.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
