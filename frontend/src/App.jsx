import { useEffect, useState } from "react";
import { apiFetch } from "./api/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiFetch("/")
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        setMessage(error.message);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h1>Food Ordering App</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;