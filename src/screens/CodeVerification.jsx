import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Logo from '../Logo.png';
import '../styles/CodeVerification.css';
import Loading from "../components/Loading";

function CodeVerification() {
  const inputs = useRef([]);
  const { handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [code, setCode] = React.useState(Array(6).fill(""));
  const [loading, setLoading] = React.useState(false);

  const onSubmit = () => {
    const joinedCode = code.join("");
    if (joinedCode.length < 6) {
      setError("code", { type: "manual", message: "Please enter a valid code" });
      return;
    }
    clearErrors("code");
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/candidates/verify-code/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinedCode })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.status !== "success") {
          setError("code", { type: "manual", message: "Please enter a valid code" });
        } else {
          localStorage.setItem("verificationCode", joinedCode);
          if (data.candidate._id) {
            localStorage.setItem("candidate_id", data.candidate._id);
          }
          if (data.candidate.hr) {
            localStorage.setItem("hr_id", data.candidate.hr);
          }
          navigate('/test');
        }
      })
      .catch(() => {
        setLoading(false);
        setError("code", { type: "manual", message: "Please enter a valid code" });
      });
  };

  const handleInput = (e, idx) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    clearErrors("code");

    if (value && idx < 5) {
      inputs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={Logo} className="App-logo" alt="logo" />
        <h2>Verification Code</h2>
        <p>Enter the 6-digit code sent by your recruiter</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="code-inputs">
            {[...Array(6)].map((_, idx) => (
              <input
                key={idx}
                ref={el => inputs.current[idx] = el}
                maxLength={1}
                className="code-input"
                value={code[idx]}
                onChange={e => handleInput(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                autoComplete="off"
                inputMode="text"
                pattern="[A-Z0-9]"
              />
            ))}
          </div>
          {errors.code && (
            <p style={{ color: "#A42F2F", marginTop: "16px", marginBottom: "0" }}>
              {errors.code.message}
            </p>
          )}
          <div className="button-row">
            <button type="submit" className="verify-btn">Verify</button>
          </div>
        </form>
      </header>
    </div>
  );
}

export default CodeVerification;