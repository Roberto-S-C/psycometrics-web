import Logo from "../Logo.png";
import "../styles/Loading.css";

export default function Loading() {
  return (
    <div className="loading-container">
      <img src={Logo} alt="Psycometrics AI Logo" className="loading-logo" />
      <div className="spinner"></div>
    </div>
  );
}