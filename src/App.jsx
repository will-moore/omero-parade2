import { useState } from "react";
import omeLogo from "./assets/ome-logomark.svg";
import "./App.css";
import Mosaic from "./Mosaic";
import TableChooser from "./TableChooser";

function App() {

  // state to hold the selected table URL
  const [tableUrl, setTableUrl] = useState(null);

  return (
    <>
      <TableChooser setTableUrl={setTableUrl} />
      <h1><img
          src={omeLogo}
          className="logo"
          alt="OME logo"
        />OMERO parade 2</h1>

      <p>Table URL: {tableUrl} </p>

      {/* For now, don't load Mosaic till we have tableUrl */}
      {tableUrl && <Mosaic tableUrl={tableUrl} />}
    </>
  );
}

export default App;
