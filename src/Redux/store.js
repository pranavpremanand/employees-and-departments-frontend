import { configureStore } from "@reduxjs/toolkit";
import departmentSlice from "./departmentSlice";
import employeeSlice from "./employeeSlice";

export const store = configureStore({
  reducer: {
    employees: employeeSlice,
    departments: departmentSlice,
  },
});
