import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type {
  CreateFormSubmissionPayload,
  FormSubmission,
} from '../../types/formSubmission';
import type { RootState } from '../../store/store';

type FormSubmissionsState = {
  submissions: FormSubmission[];
  newestSubmissionId: string | null;
};

const initialState: FormSubmissionsState = {
  submissions: [],
  newestSubmissionId: null,
};

const formSubmissionsSlice = createSlice({
  name: 'formSubmissions',
  initialState,
  reducers: {
    addFormSubmission: {
      reducer: (state, action: PayloadAction<FormSubmission>) => {
        state.submissions.unshift(action.payload);
        state.newestSubmissionId = action.payload.id;
      },
      prepare: (submission: CreateFormSubmissionPayload) => {
        return {
          payload: {
            ...submission,
            id: nanoid(),
            submittedAt: new Date().toISOString(),
          },
        };
      },
    },

    clearNewestSubmissionHighlight: (state) => {
      state.newestSubmissionId = null;
    },

    clearFormSubmissions: (state) => {
      state.submissions = [];
      state.newestSubmissionId = null;
    },
  },
});

export const {
  addFormSubmission,
  clearNewestSubmissionHighlight,
  clearFormSubmissions,
} = formSubmissionsSlice.actions;

export const selectFormSubmissions = (state: RootState) =>
  state.formSubmissions.submissions;

export const selectNewestSubmissionId = (state: RootState) =>
  state.formSubmissions.newestSubmissionId;

export default formSubmissionsSlice.reducer;
