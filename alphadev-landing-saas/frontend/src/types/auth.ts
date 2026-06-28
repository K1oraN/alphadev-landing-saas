export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
};

export type LoginResponse = {
  user: AuthUser;
  token: string;
};

export type MeResponse = {
  user: AuthUser;
};
