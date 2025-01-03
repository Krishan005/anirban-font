import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define an async thunk for API calls
export const uploadImage = createAsyncThunk(
  'data/upload',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload-image`, data); // Replace with your API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const uplaodImageSlice = createSlice({
  name: 'data',
  initialState: {
    image: [],
    imageStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    imageError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.imageStatus = 'loading';
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.imageStatus = 'succeeded';
        state.image = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.imageStatus = 'failed';
        state.imageError = action.payload;
      });
  },
});

export default uplaodImageSlice.reducer;
