export const getUserInfo = () => {
  const userData = sessionStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

export const setUserInfo = (data) => {
  sessionStorage.setItem("userInfo", JSON.stringify(data));
};
