import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  elementItems: []
  
}

export const warehouseSlide = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {
    updateWarehouse: (state, action) => {
      const { elements = []} = action.payload
      state.elementItems = elements ? elements : state.elementItems;
     
  }}
   
})

// Action creators are generated for each case reducer function
export const {updateWarehouse } = warehouseSlide.actions

export default warehouseSlide.reducer