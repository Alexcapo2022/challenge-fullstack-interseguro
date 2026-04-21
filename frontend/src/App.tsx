import { useState } from "react";
import { MatricesPage } from "./features/matrices/pages/MatricesPage";
import { LoginPage } from "./features/auth/pages/LoginPage";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return <MatricesPage onLogout={() => {
    localStorage.removeItem("token");
    setToken(null);
  }} />;
}