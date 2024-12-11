import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Alert} from 'react-native';
import {IItemObj} from '../../../App';

interface IState {
  cartData: IItemObj[];
  isCartData: boolean;
  DataInCart: IItemObj[];
}

export const requestApicall = createAsyncThunk(
  'request/requestData',
  async () => {
    const data = await fetch('https://dummyjson.com/carts');
    const arrData = await data.json();
    return arrData;
  },
);

const initialState: IState = {
  cartData: [],
  isCartData: false,
  DataInCart: [],
};

export const cartSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    increment: () => {},
    addCartItem: (state, action) => {
      state.DataInCart.push(action.payload);
      const dataItem = action.payload;
      state.cartData.map((cartitem: IItemObj, index) => {
        if (dataItem.id === cartitem.id) {
          cartitem.cartCondition = true;
        }
        return cartitem;
      });
    },

    onIncrementCount: (state, action) => {
      const dataItem = action.payload.item;
      state.cartData.map((cartItem: IItemObj) => {
        if (cartItem.id === dataItem.id) {
          cartItem.itemCount += 1;
        }
        return cartItem;
      });
      state.DataInCart = state.DataInCart.filter((cartItem: IItemObj) => {
        if (cartItem.id === dataItem.id) {
          cartItem.itemCount += 1;
        }
        return cartItem;
      });
    },
    onDecrementCount: (state, action) => {
      const dataItem = action.payload.item;
      state.cartData.forEach((cartItem: IItemObj) => {
        if (cartItem.id === dataItem.id) {
          cartItem.itemCount -= 1;
          if (cartItem.itemCount === 0) {
            cartItem.cartCondition = false;
            cartItem.itemCount = 1;
          }
        }
      });
      state.DataInCart = state.DataInCart.filter((cartItem: IItemObj) => {
        if (cartItem.id === dataItem.id) {
          cartItem.itemCount -= 1;
        }
        return cartItem.itemCount > 0;
      });
    },
  },
  extraReducers: builder => {
    builder.addCase(requestApicall.fulfilled, (state, action) => {
      if (action.payload) {
        const newData = [];
        for (let eachCart of action.payload.carts) {
          for (let eachItem of eachCart.products) {
            eachItem.itemCount = 1;
            eachItem.cartCondition = false;
            newData.push(eachItem);
          }
        }

        state.cartData = newData;
        state.isCartData = true;
      }
    });
    builder.addCase(requestApicall.pending, (state, action) => {
      state.isCartData = false;
    });
    builder.addCase(requestApicall.rejected, (state, action) => {
      Alert.alert('Something went Wrong !!, Please Try again...');
      state.isCartData = false;
    });
  },
});

export const {increment, addCartItem, onIncrementCount, onDecrementCount} =
  cartSlice.actions;
export default cartSlice.reducer;
