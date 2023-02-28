import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  departments: [],
};
const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    setDepartments: (state, action) => {
      state.departments = action.payload;
    },
    addDepartment:(state,action)=>{
        state.departments.unshift(action.payload)
    }
  },
});

export const { setDepartments,addDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;
