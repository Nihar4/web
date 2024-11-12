import { useState } from "react";
import { format } from "date-fns";

import SwiftModal from "../CustomComponents/SwiftModal/SwiftModal";

import download from "../../assets/icons/download.svg";
import uploadIcon from "../../assets/icons/upload-icon.svg";
import uploadedVideoIcon from "../../assets/icons/uploaded-video-icon.svg";

import "../../css/BackOffice/BackOfficeRight.css";

const BackOfficeBodyRightOptional = ({ currentpage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFactsheetModalOpen, setIsFactsheetModalOpen] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState({
    title: "",
    body: "",
    date: "",
  });
  const [factsheet, setFactsheet] = useState({
    title: "",
    file: null,
    date: "",
  });
  const [latestFile, setLatestFile] = useState(null);
  const [latestIcon, setLatestIcon] = useState(download);
  const [factsheetFile, setFactsheetFile] = useState(null);
  const [factsheetIcon, setFactsheetIcon] = useState(download);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [section, setSection] = useState("");

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setSection("latest-update");
  };
  const handleModalClose = () => setIsModalOpen(false);
  const handleFactsheetModalOpen = () => {
    setIsModalOpen(true);
    setSection("factsheet");
  };
  const handleFactsheetModalClose = () => setIsFactsheetModalOpen(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const currentDate = format(new Date(), "do 'of' MMMM yyyy");
    setLatestUpdate((prev) => ({ ...prev, date: currentDate }));
    console.log(latestUpdate);
    setIsModalOpen(false);
  };

  const handleFactsheetFormSubmit = (e) => {
    e.preventDefault();
    const currentDate = format(new Date(), "do 'of' MMMM yyyy");
    setFactsheet((prev) => ({ ...prev, date: currentDate }));
    setIsModalOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setLatestFile(file);
    setLatestIcon(download);
    setSelectedVideo(null);
  };

  const handleVideoUpload = (e) => {
    const video = e.target.files[0];
    setSelectedVideo(video);
    setLatestIcon(uploadedVideoIcon);
    setLatestFile(null);
  };

  const handleFactsheetFileUpload = (e) => {
    const file = e.target.files[0];
    setFactsheetFile(file);
    setFactsheetIcon(download);
  };

  const toggleVideoPlayer = () => setIsVideoOpen(!isVideoOpen);

  return (
    (currentpage === "edit" || currentpage === "preview") && (
      <div className="swift-back-office-body-right">
        <div className="back-office-latest-updates">
          <div className="back-office-header-group">
            <div className="back-office-header">Latest Updates</div>
            <button className="upload-button" onClick={handleModalOpen}>
              {currentpage === "edit" ? (
                <img src={uploadIcon} alt="Upload" />
              ) : (
                ""
              )}
            </button>
          </div>
          <div className="latest-update-items">
            <div className="latest-item-title">{latestUpdate.title}</div>
            <div className="latest-item-body">{latestUpdate.body}</div>
            <div className="latest-item-date">{latestUpdate.date}</div>
            {latestFile ? (
              <a
                href={URL.createObjectURL(latestFile)}
                download={latestFile.name}
              >
                <img
                  src={latestIcon}
                  className="item-icon"
                  alt="Download Icon"
                />
              </a>
            ) : null}
            {selectedVideo && (
              <>
                <img
                  src={latestIcon}
                  className="item-icon"
                  alt="Video Icon"
                  onClick={toggleVideoPlayer}
                  style={{ cursor: "pointer" }}
                />
                {isVideoOpen && (
                  <video
                    src={URL.createObjectURL(selectedVideo)}
                    controls
                    className="video-player"
                    autoPlay
                  />
                )}
              </>
            )}
          </div>
        </div>

        
        <div className="back-office-factsheets">
          <div className="back-office-header-group">
            <div className="back-office-header">Fact Sheets</div>
            <button
              className="upload-button"
              onClick={handleFactsheetModalOpen}
            >
              {currentpage === "edit" ? (
                <img src={uploadIcon} alt="Upload" />
              ) : (
                ""
              )}
            </button>
          </div>
          <div className="factsheets-list">
            <div className="factsheets-items">
              <div className="factsheets-item-title">{factsheet.title}</div>
              <div className="factsheets-item-date">{factsheet.date}</div>
            </div>
            {factsheetFile ? (
              <a
                href={URL.createObjectURL(factsheetFile)}
                download={factsheetFile.name}
              >
                <img
                  src={factsheetIcon}
                  className="item-icon"
                  alt="Download Icon"
                />
              </a>
            ) : null}
          </div>
        </div>

        {isModalOpen && (
          <SwiftModal closeModal={handleModalClose} className="upload-modal">
            <form
              onSubmit={
                section == "latest-update"
                  ? handleFormSubmit
                  : handleFactsheetFormSubmit
              }
              className="upload-form"
            >
              <label>
                Title:
                <input
                  type="text"
                  value={section=="latest-update"?latestUpdate.title:factsheet.title}
                  onChange={
                    section == "latest-update"
                      ? (e) =>
                          setLatestUpdate({
                            ...latestUpdate,
                            title: e.target.value
                          })
                      : (e) =>
                          setFactsheet({ ...factsheet, title: e.target.value })
                  }
                />
              </label>
              {section == "latest-update" ? (
                <label>
                  Body:
                  <textarea
                    value={latestUpdate.body}
                    rows={5}
                    onChange={
                      section == "latest-update"
                        ? (e) =>
                            setLatestUpdate({
                              ...latestUpdate,
                              body: e.target.value,
                            })
                        : (e) =>
                            setFactsheet({ ...factsheet, body: e.target.value })
                    }
                  />
                </label>
              ) : (
                ""
              )}
              <label>
                Upload File:
                <input
                  type="file"
                  accept="*"
                  onChange={
                    section == "latest-update"
                      ? handleFileUpload
                      : handleFactsheetFileUpload
                  }
                />
              </label>
              {section == "latest-update" ? (
                <label>
                  Upload Video:
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                  />
                </label>
              ) : (
                ""
              )}
              <button
                type="submit"
                className="back-office-right-submit-form-button"
              >
                Submit
              </button>
            </form>
          </SwiftModal>
        )}
        {/* {isFactsheetModalOpen && (
          <SwiftModal
            closeModal={handleFactsheetModalClose}
            className="upload-modal"
          >
            <form onSubmit={handleFactsheetFormSubmit} className="upload-form">
              <label>
                Title:
                <input
                  type="text"
                  value={factsheet.title}
                  onChange={(e) =>
                    setFactsheet({ ...factsheet, title: e.target.value })
                  }
                />
              </label>
              <label>
                Upload File:
                <input
                  type="file"
                  accept="*"
                  onChange={handleFactsheetFileUpload}
                />
              </label>
              <button
                type="submit"
                className="back-office-right-submit-form-button"
              >
                Submit
              </button>
            </form>
          </SwiftModal>
        )} */}
      </div>
    )
  );
};

export default BackOfficeBodyRightOptional;
