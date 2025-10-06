// src/utils/imageUtils.js
export const getDriveImageUrl = (url) => {
    if (!url) return "";
  
    // Extract file ID from common Google Drive formats
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const id = match[1];
      return `https://lh3.googleusercontent.com/d/${id}=s1600`; // more reliable
    }
  
    // Handle UC export links (already viewable)
    if (url.includes("drive.google.com/uc")) {
      return url.replace("export=view", "export=download");
    }
  
    // Fallback: return as is
    return url;
  };
  