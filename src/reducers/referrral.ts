import { createSlice } from '@reduxjs/toolkit';
import { Referral } from '@/type';
import { getReferral, createReferral as createApi } from '@/api';

type ReferralState = {
  loading: boolean;
  referral: Referral;
};
export const referralSlice = createSlice({
  name: 'referral',
  initialState: {
    loading: false,
    referral: null,
  },
  reducers: {
    request: (state) => {
      state.loading = true;
    },
    response: (state, action) => {
      state.loading = false;
      state.referral = action.payload;
    },
  },
});

const { request, response } = referralSlice.actions;

export const fetchReferral = () => async (dispatch: any) => {
  dispatch(request());
  const referral = await getReferral();
  dispatch(response(referral));
};

export const createReferral = () => async (dispatch: any): Promise<boolean> => {
  dispatch(request());
  const success = await createApi();
  const referral = await getReferral();
  dispatch(response(referral));
  return success;
};

export const selectReferral = (state: { referral: ReferralState }) => state.referral.referral;

export default referralSlice.reducer;
