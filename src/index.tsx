import { createRoot, Root } from "react-dom/client";
import App from "./app/App";

import connectPixiDevTools from "../devscripts/connectPixiDevTools";
import "./index.css";

window.onload = (event) => {
    const domRoot = document.getElementById("root");

    if (domRoot) {
        const reactDomRoot = createRoot(domRoot);

        renderApp(reactDomRoot, domRoot);
        addEventListener("resize", (event) => renderApp(reactDomRoot, domRoot));
    } else {
        console.error("Cannot find root element for application");
    }
};

function renderApp(reactDomRoot: Root, domRoot: HTMLElement) {
    reactDomRoot.render(<App width={domRoot.clientWidth} height={domRoot.clientHeight} />);
}

connectPixiDevTools();
