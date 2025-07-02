import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import '../styles/UserInfoForm.css';

export default function UserInfoForm({ defaultValues = {} }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues });

  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: "" });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/candidates/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      if (response.status === 409) {
        setAlert({ show: true, message: "This email is already registered." });
        setTimeout(() => setAlert({ show: false, message: "" }), 3000);
        return;
      }
      if (!response.ok) {
        setAlert({ show: true, message: "There was an error submitting your information." });
        setTimeout(() => setAlert({ show: false, message: "" }), 3000);
        return;
      }
      localStorage.setItem("candidate_id", responseData.id);
      localStorage.setItem("hr_id", responseData.hr_id);
      navigate("/test");
    } catch (error) {
      setAlert({ show: true, message: "Network error. Please try again." });
      setTimeout(() => setAlert({ show: false, message: "" }), 3000);
    }
  };

  return (
    <div className="form-viewport-center">
      <Alert message={alert.message} show={alert.show} />
      <div>
        <h2 className="form-title">PsycometricsAI</h2>
        <form className="user-info-form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Email
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </label>

          <div className="row">
            <label className="half">
              Name
              <input
                type="text"
                {...register("first_name", { required: "Name is required" })}
              />
              {errors.first_name && <span className="error">{errors.first_name.message}</span>}
            </label>
            <label className="half">
              Last Name
              <input
                type="text"
                {...register("last_name", { required: "Last name is required" })}
              />
              {errors.last_name && (
                <span className="error">{errors.last_name.message}</span>
              )}
            </label>
          </div>

          <div className="row age-gender-row">
            <label className="half">
              Age
              <input
                type="number"
                min="1"
                step="1"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 1, message: "Age must be positive" },
                  pattern: {
                    value: /^[1-9][0-9]*$/,
                    message: "Age must be a positive number"
                  }
                })}
              />
              {errors.age && <span className="error">{errors.age.message}</span>}
            </label>
            <label className="half">
              Gender
              <select
                {...register("gender", { required: "Gender is required" })}
              >
                <option value=""></option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <span className="error">{errors.gender.message}</span>}
            </label>
          </div>

          <label>
            Phone
            <input
              type="tel"
              {...register("phone", { required: "Phone is required" })}
            />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}