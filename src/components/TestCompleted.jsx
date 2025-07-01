import Logo from "../Logo.png";
import "../styles/TestCompleted.css";

export default function TestCompleted() {
  return (
    <div className="test-completed-container">
      <img src={Logo} alt="Psycometrics AI Logo" className="test-completed-logo" />
      <h2 className="test-completed-title">Thanks for completing your test</h2>
      <p className="test-completed-message">
        Your recruiter will contact you very soon
      </p>
    </div>
  );
}