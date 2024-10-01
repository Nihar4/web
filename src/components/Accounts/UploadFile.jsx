import React, { useState } from "react";
import ServerRequest from "../../utils/ServerRequest";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const data = await ServerRequest({
        method: "POST",
        URL: "/strategy/upload-test",
        data: formData,
      });

      console.log("File uploaded successfully:", data);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  return (
    <div>
      <h1>Upload File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadFile;
