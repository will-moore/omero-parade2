// React Component for navigation bar
import React from "react";

import { AddPlot } from "./PlotPopover";
import MosaicCount from "./MosaicCount";

export default function NavBar(props) {
  const { coordinator, table, selection, plots, setPlots } = props;

  function addPlot(plotConfig) {
    setPlots([...plots, plotConfig]);
  }

  const styles = {
    navbar: {
      flex: "0 0 auto",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      boxSizing: "border-box",
      background: "#333",
      color: "#fff",
    },
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={{ margin: "0 20px", fontSize: "20px", fontWeight: "200" }}>
        OMERO Parade 2
      </h1>

      {selection && (
        <div>
          <AddPlot
            table={table}
            selection={selection}
            addPlot={addPlot}
          />
        </div>
      )}

      <div style={{ flex: "1 1 auto" }}></div>
      <MosaicCount
        coordinator={coordinator}
        table={table}
        selection={selection}
      />
    </nav>
  );
}
