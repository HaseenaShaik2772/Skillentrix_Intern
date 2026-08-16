 import Card from "./components/Card";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Skillentrix Minor Project</h1>

      <div className="cards">
        <Card title="React Basics" />
        <Card title="JavaScript" />
        <Card title="Web Development" />
      </div>
    </div>
  );
}

export default App;