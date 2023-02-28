import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
};
const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    addEmployee:(state,action)=>{
        console.log(action.payload,'hdfhdf')
        state.employees.unshift(action.payload)
    }
  },
});
export const { setEmployees,addEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
