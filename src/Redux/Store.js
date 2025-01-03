// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlices';
import getAllEmployeeSlice from './getAllEmployeeSlice';
import employeeAddAndEditSlices from './EmployeeAddAndEditSlices';
import uplaodImageSlice from './UplaodImageSlices';

const store = configureStore({
  reducer: {
    data: dataReducer, // Add your reducers here,
    allemployees: getAllEmployeeSlice,
    addAndEditEmployees: employeeAddAndEditSlices,
    uploadImage: uplaodImageSlice
  },
});

export default store;
