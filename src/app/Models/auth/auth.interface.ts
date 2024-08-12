export type TLoginUser = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  email: string;
  role: string;
};

export type TPasswordData = {
  oldPassword: string;
  newPassword: string;
};
