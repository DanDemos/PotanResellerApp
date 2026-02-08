export type LoginRequest = {
  phone: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user: {
    id: number;
    phone: string;
  };
  token: string;
};

export type LogoutRequest = void;

export type LogoutResponse = {
  message: string;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

export type ChangePasswordResponse = {
  message: string;
};