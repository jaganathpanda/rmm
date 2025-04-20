// utils/userSession.js

export const getUserInfo = () => {
    const rawData = sessionStorage.getItem("userData");
  
    if (!rawData) return null;
  
    try {
      const data = JSON.parse(rawData);
      return {
        userId: data[0],
        username: data[1],
        firstName: data[2],
        lastName: data[3],
        company: data[4],
        email: data[5],
        phone: data[6],
        password: data[7], // You may omit this for security
        isAdmin: data[8],
        branchCode: data[9],
        apiEndpoint: data[10],
        role: data[11], // empty string in your example
      };
    } catch (err) {
      console.error("Error parsing userData:", err);
      return null;
    }
  };
  