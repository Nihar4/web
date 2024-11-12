import { useState, useEffect } from "react";
import moment from "moment";

import SwiftModal from "../CustomComponents/SwiftModal/SwiftModal";

import ServerRequest from "../../utils/ServerRequest";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";

import download from "../../assets/icons/download.svg";
import uploadIcon from "../../assets/icons/upload-icon.svg";
import uploadedVideoIcon from "../../assets/icons/uploaded-video-icon.svg";
import CloseIcon from "@mui/icons-material/Close";
import Close from "../../assets/crossicon.svg";

import "../../css/BackOffice/BackOfficeRight.css";

const BackOfficeBodyRight = ({ currentpage, selectedfund }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [change, setHandleChange] = useState(0);
  const [isFactsheetModalOpen, setIsFactsheetModalOpen] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState([]);
  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    body: "",
  });
  const [factsheet, setFactsheet] = useState([]);
  const [sheetFormData, setSheetFormData] = useState({
    title: "",
  });
  const [error, setError] = useState({
    title: "",
    body: "",
    fileVideo: "",
  });

  const [latestFile, setLatestFile] = useState(null);
  const [factsheetFile, setFactsheetFile] = useState(null);
  const [factsheetIcon, setFactsheetIcon] = useState(download);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    console.log("closedIcon");
  };
  const handleFactsheetModalOpen = () => setIsFactsheetModalOpen(true);
  const handleFactsheetModalClose = () => setIsFactsheetModalOpen(false);

  useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        const response = await ServerRequest({
          method: "get",
          URL: `/back-office/funds/${selectedfund}/updates/get`,
        });
        console.log(response.fundUpdates);

        setLatestUpdate(response.fundUpdates);
      } catch (error) {
        console.error("Error fetching latest updates:", error);
      }
    };
    console.log(selectedfund);

    if (selectedfund) fetchLatestUpdates();
  }, [selectedfund, change]);

  useEffect(() => {
    const fetchFactSheets = async () => {
      try {
        const response = await ServerRequest({
          method: "get",
          URL: `/back-office/funds/${selectedfund}/factsheets/get`,
        });

        setFactsheet(response.fundFactSheets);
      } catch (error) {
        console.error("Error fetching factsheets:", error);
      }
    };
    console.log(selectedfund);

    if (selectedfund) fetchFactSheets();
  }, [selectedfund, change]);
  const errorForm = () => {
    let formIsValid = true;
    const newErrorState = { title: "", body: "", fileVideo: "" };
    if (updateFormData.title.trim() === "") {
      newErrorState.title = "Title cannot be empty";
      formIsValid = false;
    }

    if (updateFormData.body.trim() === "") {
      newErrorState.body = "Body cannot be empty";
      formIsValid = false;
    } else if (updateFormData.body.length > 500) {
      newErrorState.body = "Body cannot exceed 500 characters";
      formIsValid = false;
    }
    if (!latestFile && !selectedVideo) {
      newErrorState.fileVideo = "Please upload a file or a video";
      formIsValid = false;
    }

    setError(newErrorState);
    return formIsValid;
  };
  const errorFactsheetForm = () => {
    let formIsValid = true;
    const newErrorState = { title: "", fileVideo: "" };

    if (sheetFormData.title.trim() === "") {
      newErrorState.title = "Title cannot be empty";
      formIsValid = false;
    }

    if (!factsheetFile) {
      newErrorState.fileVideo = "Please upload a factsheet file";
      formIsValid = false;
    }

    setError(newErrorState);
    return formIsValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!errorForm()) return;
    const currentDate = new Date().toISOString().split("T")[0];

    try {
      const formData = new FormData();

      formData.append("title", JSON.stringify(updateFormData.title));
      formData.append("body", JSON.stringify(updateFormData.body));
      formData.append("date", JSON.stringify(currentDate));
      formData.append("fundId", JSON.stringify(selectedfund));

      if (latestFile) {
        formData.append("file", latestFile);
      }
      if (selectedVideo) {
        formData.append("video", selectedVideo);
      }

      const updatedata = await ServerRequest({
        method: "post",
        URL: `/back-office/funds/${selectedfund}/updates`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setHandleChange(Math.random());
      

      setIsModalOpen(false);
      setUpdateFormData({ title: "", body: "" });
      setLatestFile(null);
    } catch (error) {
      console.error("Error submitting update:", error);
    }
  };

  const handleFactsheetFormSubmit = async (e) => {
    e.preventDefault();
    if (!errorFactsheetForm()) return;
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      const formData = new FormData();

      formData.append("title", JSON.stringify(sheetFormData.title));
      formData.append("date", JSON.stringify(currentDate));
      formData.append("fundId", JSON.stringify(selectedfund));

      if (factsheetFile) {
        formData.append("file", factsheetFile);
      }
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const sheetsdata = await ServerRequest({
        method: "post",
        URL: `/back-office/funds/${selectedfund}/factsheets`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setHandleChange(Math.random());
      setSheetFormData({title : ""})
      setFactsheetFile(null)

      setIsFactsheetModalOpen(false);
    } catch (error) {
      console.error("Error submitting factsheets:", error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setLatestFile(file);
    
  };

  const handleVideoUpload = (e) => {
    const video = e.target.files[0];
    setSelectedVideo(video);
    
  };

  const handleFactsheetFileUpload = (e) => {
    const file = e.target.files[0];
    setFactsheetFile(file);
    setFactsheetIcon(download);
  };

  

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  return (
    (currentpage === "edit" || currentpage === "preview") && (
      <div className="swift-back-office-body-right">
        <div className="swift-back-office-body-right-latest-updates">
          <div className="swift-back-office-body-right-header-group">
            <div className="swift-back-office-body-right-header">
              Latest Updates
            </div>
            <button
              className="swift-back-office-body-right-upload-button"
              onClick={handleModalOpen}
            >
              {currentpage === "edit" ? (
                <img src={uploadIcon} alt="Upload" />
              ) : (
                ""
              )}
            </button>
          </div>
          <div className="swift-back-office-body-right-latest-update-items">
            {latestUpdate?.map((update) => (
              <div key={update.id}>
                <div className="swift-back-office-body-right-latest-item-title">
                  {update.title}
                </div>
                <div className="swift-back-office-body-right-latest-item-body">
                  {update.description}
                </div>
                <div className="swift-back-office-body-right-latest-item-date">
                  {moment(update.date).format("Do [of] MMMM YYYY")}
                </div>
                <div className="swift-back-office-body-right-latest-update-icons">
                  {update.doc_url && (
                    <a onClick={() => handleDownload(update.doc_url)} download>
                      <img
                        src={download}
                        className="swift-back-office-body-right-item-icon"
                        alt="Download Icon"
                      />
                    </a>
                  )}
                  {update.video_url && (
                    <>
                      <img
                        src={uploadedVideoIcon}
                        className="swift-back-office-body-right-item-icon"
                        alt="Video Icon"
                        onClick={() => {
                          setIsVideoOpen(true);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      {isVideoOpen && (
                        <SwiftModal
                          closeModal={() => {
                            setIsVideoOpen(false);
                          }}
                          top="1%"
                          className="swift-back-office-body-right-video-modal"
                        >
                          <div className="swift-back-office-body-right-video-modal-container">
                            <div className="swift-back-office-body-right-modal-header">
                              <CloseIcon
                                className="swift-back-office-body-right-close-icon"
                                onClick={() => {
                                  setIsVideoOpen(false);
                                }}
                              />
                            </div>

                            <div className="swift-back-office-body-right-video-container">
                              <video
                                src={update.video_url}
                                controls
                                className="swift-back-office-body-right-video-player"
                                autoPlay
                              />
                            </div>
                          </div>
                        </SwiftModal>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="swift-back-office-body-right-factsheets">
          <div className="swift-back-office-body-right-header-group">
            <div className="swift-back-office-body-right-header">
              Fact Sheets
            </div>
            <button
              className="swift-back-office-body-right-upload-button"
              onClick={handleFactsheetModalOpen}
            >
              {currentpage === "edit" ? (
                <img src={uploadIcon} alt="Upload" />
              ) : (
                ""
              )}
            </button>
          </div>
          <div className="swift-back-office-body-right-factsheets-list">
            {factsheet?.map((sheet) => (
              <div
                key={sheet.id}
                className="swift-back-office-body-right-factsheets-items"
              >
                <div className="swift-back-office-body-right-fact-sheet-item-container">
                  <div className="swift-back-office-body-right-factsheets-item-title">
                    {sheet.title}
                  </div>
                  <div className="swift-back-office-body-right-factsheets-item-date">
                    {moment(sheet.date).format("Do [of] MMMM YYYY")}
                  </div>
                </div>

                {sheet.url && (
                  <a href={sheet.url} download>
                    <img
                      src={download}
                      className="swift-back-office-body-right-item-icon"
                      alt="Download Icon"
                    />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <SwiftModal closeModal={handleModalClose}>
            <div className="swift-back-office-body-right-upload-modal">
              <div className="swift-back-office-body-right-upload-modal-header">
                <div className="custom__alert__close">
                  <img src={Close} alt="X" onClick={handleModalClose} />
                </div>
              </div>
              <form
                onSubmit={handleFormSubmit}
                className="swift-back-office-body-right-upload-form"
              >
                <CustomInputError
                  labelText="Title"
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  value={updateFormData.title}
                  onInputChange={(name, value) =>
                    setUpdateFormData({ ...updateFormData, [name]: value })
                  }
                  error={error.title}
                  classnameDiv="form-group"
                  classnameLabel="form-label"
                  classnameInput="form-control"
                  classnameError="swift-back-office-error"
                />

                <label
                  className="swift-back-office-body-right-form-label"
                  htmlFor="body"
                >
                  Body
                </label>
                <textarea
                  id="body"
                  name="body"
                  className="form-control"
                  rows={5}
                  placeholder="Maximum 500 characters"
                  value={updateFormData.body}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      body: e.target.value,
                    })
                  }
                  maxLength="500"
                />
                {error.body && (
                  <div className="swift-back-office-error">{error.body}</div>
                )}
                <div className="swift-back-office-body-right-file-input">
                  <p>Upload File</p>
                  <label htmlFor="hiddenInput">Upload</label>
                  <input
                    id="hiddenInput"
                    type="file"
                    accept="image/*, .pdf, .doc, .docx, .xls, .xlsx, .txt"
                    onChange={handleFileUpload}
                  />

                  {latestFile && <span>{latestFile.name}</span>}
                </div>

                <div className="swift-back-office-body-right-file-input">
                  <p>Upload Video</p>
                  <label htmlFor="hiddenInputVideo">Upload</label>
                  <input
                    id="hiddenInputVideo"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                  />
                  {selectedVideo && <span>{selectedVideo.name}</span>}
                </div>
                {error.fileVideo && (
                  <div className="swift-back-office-error">
                    {error.fileVideo}
                  </div>
                )}
                <button
                  type="submit"
                  className="swift-back-office-body-right-submit-form-button"
                >
                  Submit
                </button>
              </form>
            </div>
          </SwiftModal>
        )}

        {isFactsheetModalOpen && (
          <SwiftModal closeModal={handleFactsheetModalClose}>
            <div className="swift-back-office-body-right-upload-modal">
              <div className="swift-back-office-body-right-upload-modal-header">
                <div className="custom__alert__close">
                  <img src={Close} alt="X" onClick={handleFactsheetModalClose} />
                </div>
              </div>
              <form
                onSubmit={handleFactsheetFormSubmit}
                className="swift-back-office-body-right-upload-form"
              >
                <CustomInputError
                  labelText="Title"
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  value={sheetFormData.title}
                  onInputChange={(name, value) =>
                    setSheetFormData({ ...sheetFormData, [name]: value })
                  }
                  error={error.title}
                  classnameDiv="form-group"
                  classnameLabel="form-label"
                  classnameInput="form-control"
                  classnameError="swift-back-office-error"
                />
                <div className="swift-back-office-body-right-file-input">
                  <p>Upload File</p>
                  <label htmlFor="hiddenInput">Upload</label>
                  <input
                    id="hiddenInput"
                    type="file"
                    accept="image/*, .pdf, .doc, .docx, .xls, .xlsx, .txt"
                    onChange={handleFactsheetFileUpload}
                  />
                  {factsheetFile && <span>{factsheetFile.name}</span>}
                </div>
                {error.fileVideo && (
                  <div className="swift-back-office-error">
                    {error.fileVideo}
                  </div>
                )}
                <button
                  type="submit"
                  className="swift-back-office-body-right-submit-form-button"
                >
                  Submit
                </button>
              </form>
            </div>
          </SwiftModal>
        )}
      </div>
    )
  );
};

export default BackOfficeBodyRight;
