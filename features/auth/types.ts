export type FormInputsType = {
  inputs: {
    username: {
      value: string;
      isValid: boolean;
    };
    password: {
      value: string;
      isValid: boolean;
    };
  };
  formIsValid: boolean;
};

export interface User {
  _id: string;
  name: string;
  accessToken: string;
}

export interface InitialAuthStateType {
  name: User | null;
  accessToken: string | null;
  userLoading: boolean | null;
  userId: string | null;
}
