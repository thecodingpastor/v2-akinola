import { useAppDispatch } from "../fetchConfig/store";
import axios from "../fetchConfig/api/axios";

import { LogOut } from "../features/auth/authApi";
import { SetCredentials } from "../features/auth/authSlice";
import { AddAlertMessage } from "../features/UI/UISlice";

const useRefreshToken = () => {
  const dispatch = useAppDispatch();
  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh-token", {
        withCredentials: true,
      });
      dispatch(
        SetCredentials({
          // user: response.data.user,
          userId: response.data.userId,
          accessToken: response.data.accessToken,
        })
      );
      return response.data.accessToken;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({ message: err.response.data.message, type: "fail" })
      );
      dispatch(LogOut());
    }
  };
  return refresh;
};

export default useRefreshToken;
