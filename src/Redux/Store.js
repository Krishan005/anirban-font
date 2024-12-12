// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlices';
import getAllEmployeeSlice from './getAllEmployeeSlice';
import createNewEmployeeSlices from './createEmployeeSlices';
import uplaodImageSlice from './UplaodImageSlices';

const store = configureStore({
  reducer: {
        data: dataReducer, // Add your reducers here,
        allemployees: getAllEmployeeSlice,
        newEmployees: createNewEmployeeSlices,
      uploadImage: uplaodImageSlice
  },
});

export default store;
