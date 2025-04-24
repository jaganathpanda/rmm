export const formatDateDDMMYYYY = (dateStr, includeTime = false) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
  
    const day = `${date.getDate()}`.padStart(2, "0");
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const year = date.getFullYear();
  
    if (includeTime) {
      const hours = `${date.getHours()}`.padStart(2, "0");
      const minutes = `${date.getMinutes()}`.padStart(2, "0");
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
  
    return `${day}-${month}-${year}`;
  };
  
  export const formatToInputDate = (ddmmyyyy) => {
    if (!ddmmyyyy) return "";
    const [day, month, year] = ddmmyyyy.split("-");
    if (!day || !month || !year) return "";
    return `${year}-${month}-${day}`;
  };
// utils/dateUtils.js
export const formatDateYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";
  
    const date = new Date(dateStr);
  
    if (isNaN(date.getTime())) return "";
  
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  };
    