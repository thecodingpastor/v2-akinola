import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../fetchConfig/store";
import { AlertMessageType, UIStateType } from "./types";

const initialState: UIStateType = {
  alertMessages: [],
  showModal: "",
  hits: 0,
  checkAuthOnFocus: false,
};

export const UISlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    AddAlertMessage: (state, action: PayloadAction<AlertMessageType>) => {
      const { message, type } = action.payload;
      // This prevents duplicate error messages
      if (state.alertMessages.find((alert) => alert.message === message)) {
        return;
      }
      const newAlert = {
        id: Date.now(),
        message: message || "Something went wrong",
        type: type || "fail",
      };

      state.alertMessages.push(newAlert);
    },
    RemoveAlertMessage: (state, action) => {
      state.alertMessages = state.alertMessages.filter(
        (alert) => alert.id !== action.payload
      );
    },
    ClearAlertMessages: (state) => {
      state.alertMessages = [];
    },
    SetConfirmModal: (state, action: PayloadAction<string>) => {
      state.showModal = action.payload;
    },
    SetHits: (state, action: PayloadAction<number>) => {
      state.hits = action.payload;
    },
  },
});

export const {
  AddAlertMessage,
  RemoveAlertMessage,
  ClearAlertMessages,
  SetConfirmModal,
  SetHits,
} = UISlice.actions;

export const SelectUI = (state: RootState) => state.UI;

export default UISlice.reducer;
