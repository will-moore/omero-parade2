import { useState } from "react";

import { coordinator } from "@uwdata/mosaic-core";

import "./App.css";
import "../public/style.css"
import { TABLE_NAME } from "./Mosaic";
import Mosaic from "./Mosaic";
import TableChooser from "./TableChooser";
import { AddPlot } from "./PlotPopover";
import NavBar from "./NavBar";
import { FooterTable } from "./FooterTable";
import Thumbnails from "./Thumbnails";
import SidePanel from "./SidePanel";

function App() {
  // state to hold the selected table URL
  const [tableUrl, setTableUrl] = useState(null);
  const [footerTab, setFooterTab] = useState("table");
  const [selectedRows, setSelectedRows] = useState([]);

  const styles = {
    main: {
      flex: "1 1 auto",
      display: "flex",
      flexDirection: "row",
      background: "#f6f6f6",
    },
    center: {
      flex: "1 1 auto",
      display: "flex",
      flexDirection: "column",
    },
    sidebar: {
      flex: "0 0 350px",
      overflow: "auto",
      padding: "15px",
      fontSize: "14px",
      backgroundColor: "#fff",
      borderLeft: "solid #333 1px",
      boxSizing: "border-box",
    },
    plots: {
      flex: "1 1 auto",
      height: "200px",
      overflow: "auto",
      position: "relative",
    },
    footer: {
      flex: "0 0 auto",
      height: "300px",
      background: "#fff",
      borderRadius: "10px",
      float: "left",
      boxSizing: "border-box",
      overflow: "auto",
      margin: "10px",
      padding: "10px",
      position: "relative",
    },
  };

  const [selection, setSelection] = useState(null);
  const [click, setClick] = useState(null);
  const [barAxisWidth, setBarAxisWidth] = useState(null);

  return (
    <>
      <TableChooser setTableUrl={setTableUrl} />

      {/* <AddPlot /> */}

      <NavBar
        coordinator={coordinator()}
        table={TABLE_NAME}
        selection={selection}
      />

      {/* main content */}
      <div style={styles.main}>
        <div style={styles.center}>
          <div style={styles.plots}>
            {/* For now, don't load Mosaic till we have tableUrl */}
            {tableUrl && (
              <Mosaic
                tableUrl={tableUrl}
                setSelection={setSelection}
                selection={selection}
                setClick={setClick}
                click={click}
                setBarAxisWidth={setBarAxisWidth}
                barAxisWidth={barAxisWidth}
              />
            )}
          </div>
          <div style={styles.footer}>
            <div style={{ borderBottom: "solid #ccc 1px", marginBottom: "10px" }}>
              <input
                type="radio"
                id="footer-table"
                name="footer-tab"
                value="table"
                checked={footerTab === "table"}
                onChange={() => setFooterTab("table")}
              />
              <label htmlFor="footer-table" style={{ marginRight: "15px" }}>
                Table
              </label>
              <input
                type="radio"
                id="footer-thumbnails"
                name="footer-tab"
                value="thumbnails"
                checked={footerTab === "thumbnails"}
                onChange={() => setFooterTab("thumbnails")}
              />
              <label htmlFor="footer-thumbnails">Thumbnails</label>
            </div>
            <div style={{ display: footerTab === "table" ? "block" : "none" }}>
              <FooterTable
                coordinator={coordinator()}
                table={TABLE_NAME}
                selection={selection}
              />
            </div>
            <div
              style={{ display: footerTab === "thumbnails" ? "block" : "none" }}
            >
              <Thumbnails
                coordinator={coordinator()}
                table={TABLE_NAME}
                selection={selection}
                setSelectedRows={setSelectedRows}
                selectedRows={selectedRows}
              />
            </div>
          </div>
        </div>

        <div style={styles.sidebar}>
            <SidePanel
                selectedRows={selectedRows}
              />
        </div>
      </div>
    </>
  );
}

export default App;
