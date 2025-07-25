import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import '../styles/UserInfoForm.css';

export default function UserInfoForm({ defaultValues = {} }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({ defaultValues });

  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(false); // Add loading state

  const onSubmit = async (data) => {
    setLoading(true); // Show Loading component
    try {
      const formData = new FormData();

      // Append form fields to FormData
      formData.append("email", data.email);
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("age", data.age);
      formData.append("gender", data.gender);
      formData.append("phone", data.phone);

      // Append the resume file
      if (data.resume && data.resume[0]) {
        formData.append("cv", data.resume[0]);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.status === 409) {
        setLoading(false); // Hide Loading component
        setAlert({ show: true, message: "This email is already registered." });
        setTimeout(() => setAlert({ show: false, message: "" }), 3000);
        return;
      }

      if (!response.ok) {
        setLoading(false); // Hide Loading component
        setAlert({ show: true, message: "There was an error submitting your information." });
        setTimeout(() => setAlert({ show: false, message: "" }), 3000);
        return;
      }

      localStorage.setItem("candidate_id", responseData.id);
      localStorage.setItem("hr_id", responseData.hr_id);
      navigate("/code-verification");
    } catch (error) {
      setLoading(false); // Hide Loading component
      setAlert({ show: true, message: "Network error. Please try again." });
      setTimeout(() => setAlert({ show: false, message: "" }), 3000);
    }
  };

  if (loading) {
    return <Loading />; // Show Loading component while loading
  }

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
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
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
              {errors.last_name && <span className="error">{errors.last_name.message}</span>}
            </label>
          </div>

          <div className="row age-gender-row">
            <label className="half">
              Age
              <input
                type="number"
                min="18"
                max="100"
                step="1"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 18, message: "Age must be at least 18" },
                  max: { value: 100, message: "Age cannot exceed 100" },
                  pattern: {
                    value: /^[1-9][0-9]*$/,
                    message: "Age must be a positive number",
                  },
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

          <label>
            Upload Resume (PDF only)
            <div className="custom-file-input">
              {watch("resume")?.[0]?.name ? (
                <>
                  <span className="file-name">{watch("resume")[0].name}</span>
                  <button
                    type="button"
                    className="remove-file-button"
                    onClick={() => {
                      document.querySelector('input[name="resume"]').value = null; // Clear the file input
                      setValue("resume", null); // Clear the value in react-hook-form
                    }}
                  >
                    Remove File
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => document.querySelector('input[name="resume"]').click()} // Trigger file input
                >
                  Choose File
                </button>
              )}
              <input
                type="file"
                accept=".pdf"
                style={{ display: "none" }} // Hide the file input
                {...register("resume", {
                  required: "Please upload your resume",
                  validate: {
                    isPdf: (fileList) =>
                      fileList && fileList.length === 1 && fileList[0]?.type === "application/pdf" || "Only one PDF file is allowed",
                  },
                })}
              />
            </div>
            {errors.resume && <span className="error">{errors.resume.message}</span>}
          </label>

          <button type="submit">Submit</button>
        </form>
        <Link to="/code-verification" id="code-verification-link">Already submitted your data?</Link>
      </div>
    </div>
  );
}