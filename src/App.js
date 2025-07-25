import { Routes, Route } from "react-router-dom";
import UserInfoForm from "./screens/UserInfoForm";
import Test from "./screens/Test";
import CodeVerification from "./screens/CodeVerification";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserInfoForm/>} />
      <Route path="/code-verification" element={<CodeVerification />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

export default App;