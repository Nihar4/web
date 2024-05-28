import React, { useEffect, useRef } from "react";
import "./SwiftModal.css";
import { createPortal } from "react-dom";

function SwiftModal({
  children = <></>,
  opacity = 0.5,
  top = "10%",
  closeModal = () => { },
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal && closeModal();
    }
  };

  return (
    <>
      {createPortal(
        <div
          className="swift-modal"
          style={{
            background: `rgba(140, 140, 140, ${opacity})`,
            paddingTop: `${top}`,
          }}
        >
          <div className="swift-modal-box" ref={modalRef}>
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default SwiftModal;
