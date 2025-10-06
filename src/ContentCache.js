// contentCache.js
let cachedContent = null;

const getContent = () => {
  if (cachedContent) return cachedContent;
  const sessionData = sessionStorage.getItem("dynamicContent");
  return sessionData ? JSON.parse(sessionData) : null;
};

const setContent = (data) => {
  cachedContent = data;
  sessionStorage.setItem("dynamicContent", JSON.stringify(data));
};

const clearContent = () => {
  cachedContent = null;
  sessionStorage.removeItem("dynamicContent");
};

export { getContent, setContent, clearContent };
