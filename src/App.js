import { Routes, Route } from "react-router-dom";
import UserInfoForm from "./screens/UserInfoForm";
import Test from "./screens/Test";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserInfoForm/>} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

export default App;