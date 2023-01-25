import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";

window.onload = async (event) => {
    createRoot(document.body).render(<App />);
};
