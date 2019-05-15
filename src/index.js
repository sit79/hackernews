import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"

ReactDOM.render(<App />, document.getElementById("root"))

// Hot Module Replacement enabled

if (module.hot) {
  module.hot.accept()
}
