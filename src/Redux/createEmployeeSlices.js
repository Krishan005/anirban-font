import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define an async thunk for API calls
export const createEmployee = createAsyncThunk(
  'data/employee',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/employee`, data); // Replace with your API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const createNewEmployeeSlices = createSlice({
  name: 'data',
  initialState: {
    AddedEmployee: [],
    newEmployeestatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    newEmployeeerror: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.newEmployeestatus = 'loading';
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.newEmployeestatus = 'succeeded';
        state.AddedEmployee = action.payload;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.newEmployeestatus = 'failed';
        state.newEmployeeerror = action.payload;
      });
  },
});

export default createNewEmployeeSlices.reducer;
