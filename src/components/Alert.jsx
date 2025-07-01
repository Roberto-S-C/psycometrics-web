import React from "react";
import "../styles/Alert.css";

export default function Alert({ message, show }) {
  if (!show) return null;
  return (
    <div className="custom-alert">
      {message}
    </div>
  );
}