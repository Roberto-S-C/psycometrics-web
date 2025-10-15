import Logo from "../Logo.png";
import "../styles/TestCompleted.css";

export default function TestCompleted() {
  return (
    <div className="test-completed-container">
      <img src={Logo} alt="Psycometrics AI Logo" className="test-completed-logo" />
      <h2 className="test-completed-title">Gracias por completar tu prueba</h2>
      <p className="test-completed-message">
        Tu reclutador se pondrá en contacto contigo muy pronto
      </p>
    </div>
  );
}