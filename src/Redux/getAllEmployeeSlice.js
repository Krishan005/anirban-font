// src/features/dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define an async thunk for API calls
export const fetchDataEmployee = createAsyncThunk(
  'data/fetchDataEmployee',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/employee`); // Replace with your API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getAllEmployeeSlice = createSlice({
  name: 'data',
  initialState: {
    employees: [],
    employeesstatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    employeeserror: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataEmployee.pending, (state) => {
        state.employeesstatus = 'loading';
      })
      .addCase(fetchDataEmployee.fulfilled, (state, action) => {
        state.employeesstatus = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchDataEmployee.rejected, (state, action) => {
        state.employeesstatus = 'failed';
        state.employeeserror = action.payload;
      });
  },
});

export default getAllEmployeeSlice.reducer;
