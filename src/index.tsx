import { createRoot } from "react-dom/client";
import App from "./app/App";

import connectPixiDevTools from "../devscripts/connectPixiDevTools";
import "./index.css";

window.onload = (event) => {
    createRoot(document.body).render(<App />);
};

connectPixiDevTools();
