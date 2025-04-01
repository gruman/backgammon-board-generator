import React, { useState, useRef } from "react";
import defaultBoard from "./assets/defaultBoard.json"; // Import the JSON file
import './App.css'

interface Checker {
  position: number;
  color: string | null;
  checkers: number;
}

const App: React.FC = () => {

  const svgRef = useRef<SVGSVGElement>(null);

  const [checkers, setCheckers] = useState<Checker[]>(defaultBoard);
  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify(defaultBoard, null, 2));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateBoard = () => {
    return (
      <div className="container">
        <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320" width="600" height="300">
          <rect x="0" y="0" width="750" height="300" fill="#f4d7b5" />
          <g>
            <polygon points="25,160 55,300 5,300" fill="#bbb" />
            <polygon points="85,160 115,300 65,300" fill="#ffffff" />
            <polygon points="145,160 175,300 125,300" fill="#bbb" />
            <polygon points="205,160 235,300 185,300" fill="#ffffff" />
            <polygon points="265,160 295,300 245,300" fill="#bbb" />
            <polygon points="325,160 355,300 305,300" fill="#ffffff" />
            <polygon points="385,160 415,300 365,300" fill="#bbb" />
            <polygon points="445,160 475,300 425,300" fill="#ffffff" />
            <polygon points="505,160 535,300 485,300" fill="#bbb" />
            <polygon points="565,160 595,300 545,300" fill="#ffffff" />
            <polygon points="625,160 655,300 605,300" fill="#bbb" />
            <polygon points="685,160 715,300 665,300" fill="#ffffff" />
          </g>
          <g>
            <polygon points="25,140 55,0 5,0" fill="#ffffff" />
            <polygon points="85,140 115,0 65,0" fill="#bbb" />
            <polygon points="145,140 175,0 125,0" fill="#ffffff" />
            <polygon points="205,140 235,0 185,0" fill="#bbb" />
            <polygon points="265,140 295,0 245,0" fill="#ffffff" />
            <polygon points="325,140 355,0 305,0" fill="#bbb" />
            <polygon points="385,140 415,0 365,0" fill="#ffffff" />
            <polygon points="445,140 475,0 425,0" fill="#bbb" />
            <polygon points="505,140 535,0 485,0" fill="#ffffff" />
            <polygon points="565,140 595,0 545,0" fill="#bbb" />
            <polygon points="625,140 655,0 605,0" fill="#ffffff" />
            <polygon points="685,140 715,0 665,0" fill="#bbb" />
          </g>


          <rect x="356" y="0" width="10" height="300" fill="#663300" />
          {checkers.map((item, index) => {
            const x = item.position <= 12
              ? 29 + (item.position - 1) * 60 // Bottom half positions (1 to 12)
              : 30 + (item.position - 13) * 60; // Top half positions (13 to 24)

            const y = item.position <= 12
              ? 288 // Bottom triangles (anchored at the base)
              : 10; // Top triangles (anchored at the tip)
            return Array.from({ length: item.checkers }).map((_, i) => (
              <circle
                key={`${index}-${i}`}
                cx={x}
                cy={item.position <= 12 ? y - i * 20 : y + i * 20}
                r="10"
                fill={item.color || "transparent"}
              />
            ));
          })}

        </svg>
      </div>
    );
  };

  const handleGenerateBoard = () => {
    setErrorMessage(null);
    try {
      const parsedJson: Checker[] = JSON.parse(jsonInput);
      if (Array.isArray(parsedJson) && parsedJson.every((item) => "position" in item && "color" in item && "checkers" in item)) {
        setCheckers(parsedJson);
        setErrorMessage(null);
      } else {
        throw new Error("Invalid JSON structure.");
      }
    } catch (err) {
      setErrorMessage("Invalid JSON. Please check your input.");
    }
  };

  const loadDefault = () => {

    setCheckers(defaultBoard);
    setErrorMessage(null);
    setJsonInput(JSON.stringify(defaultBoard, null, 2))
  }

  const downloadPNG = () => {
    if (svgRef.current) {
      const svgElement = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svgElement);

      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        const pngData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "backgammon_board.png";
        link.href = pngData;
        link.click();
      };

      img.src = url;
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1><a href="/">Backgammon Board Generator</a></h1>
      {generateBoard()}
      <textarea
        style={{
          width: "100%",
          height: "150px",
          fontFamily: "monospace",
          whiteSpace: "pre",
          marginBottom: "1rem",
        }}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <button onClick={loadDefault}>Load default</button>
        <button onClick={handleGenerateBoard}>Generate board</button>
        <button onClick={downloadPNG}>Download</button>
      </div>
      {errorMessage && <p style={{ color: "white" }}>{errorMessage}</p>}
    </div>
  );
};

export default App;
