import React from 'react';

const GoogleDrivePreview = ({ publicFileUrl }) => {
  const encodedUrl = encodeURIComponent(publicFileUrl);
  const embedUrl = `https://drive.google.com/viewerng/viewer?url=${encodedUrl}&embedded=true`;

  return (
    <iframe
      src={embedUrl}
      width="640"
      height="480"
      frameBorder="0"
    ></iframe>
  );
};
  export default GoogleDrivePreview;
