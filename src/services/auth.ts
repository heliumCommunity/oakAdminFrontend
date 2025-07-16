import API from "@/lib/axios";

export const login = async (email: string, password: string) => {
  const res = await API.post("/oakcollectionsadmin/auth/log-in", {
    email,
    password,
  });
  return res.data;
};
