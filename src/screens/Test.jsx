import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import TestCompleted from "../components/TestCompleted";
import "../styles/Test.css";
import getTest from "../scripts/getTest";

export default function Test() {
  const [testId, setTestId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const candidate_id = localStorage.getItem("candidate_id");
    const hr_id = localStorage.getItem("hr_id");
    if (!candidate_id || !hr_id) {
      navigate("/", { replace: true });
      return;
    }

    getTest(candidate_id)
      .then(data => {
        setTestId(data._id);
        setQuestions(data.questions || []);
      })
      .catch(error => {
        console.error("Error fetching test data:", error);
        setAlert({ show: true, message: "Error fetching test data." });
      });
  }, [navigate]);

  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));

  const handleNext = () => {
    if (selected[current] === undefined) {
      setAlert({ show: true, message: "Por favor selecciona una opción antes de continuar" });
      setTimeout(() => setAlert({ show: false, message: "" }), 2500);
      return;
    }
    setCurrent((c) => Math.min(questions.length - 1, c + 1));
  };

  const handleFinish = async () => {
    if (selected[current] === undefined) {
      setAlert({ show: true, message: "Por favor selecciona una opción antes de continuar" });
      setTimeout(() => setAlert({ show: false, message: "" }), 2500);
      return;
    }
    const candidate_id = localStorage.getItem("candidate_id");
    const hr_id = localStorage.getItem("hr_id");
    if (!candidate_id || !hr_id) {
      navigate("/", { replace: true });
      return;
    }

    // Build the responses array
    const responses = questions.map((q, idx) => ({
      question_id: q.id,
      response: q.options[selected[idx]]
    }));

    const payload = {
      test_id: testId,
      candidate_id,
      hr_id,
      responses
    };

    setLoading(true);
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/results/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setCompleted(true);
    } catch (error) {
      setAlert({ show: true, message: "Error enviando respuestas" });
      setTimeout(() => setAlert({ show: false, message: "" }), 2500);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx) => {
    setSelected({ ...selected, [current]: idx });
  };

  if (loading) {
    return <Loading />;
  }

  if (completed) {
    return (
      <>
        <Alert message={alert.message} show={alert.show} />
        <TestCompleted />
      </>
    );
  }

  if (!questions.length) {
    return <Loading />;
  }

  const q = questions[current];

  return (
    <div className="test-screen">
      <Alert message={alert.message} show={alert.show} />
      <div className="question-block">
        <h2 className="question-text">{q.question}</h2>
        {Array.isArray(q.options) && (
          <ul className="options-list">
            {q.options.map((opt, idx) => (
              <li
                key={idx}
                className={`custom-option${selected[current] === idx ? " selected" : ""}`}
                onClick={() => handleSelect(idx)}
                tabIndex={0}
                onKeyPress={e => {
                  if (e.key === "Enter" || e.key === " ") handleSelect(idx);
                }}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="test-nav-arrows">
        <span
          className={`arrow-nav${current === 0 ? " disabled" : ""}`}
          onClick={current === 0 ? undefined : handlePrev}
          tabIndex={current === 0 ? -1 : 0}
          role="button"
          aria-disabled={current === 0}
        >
          <span className="arrow-icon" aria-hidden>&lt;</span> Anterior
        </span>
        <span
          className="arrow-nav"
          onClick={
            current === questions.length - 1
              ? handleFinish
              : handleNext
          }
          tabIndex={0}
          role="button"
          aria-disabled={false}
        >
          {current === questions.length - 1
            ? <>Finalizar <span className="arrow-icon" aria-hidden>&gt;</span></>
            : <>Siguiente <span className="arrow-icon" aria-hidden>&gt;</span></>
          }
        </span>
      </div>
      <div className="test-progress">
        Pregunta {current + 1} de {questions.length}
      </div>
    </div>
  );
}