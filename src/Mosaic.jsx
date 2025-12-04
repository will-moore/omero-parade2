import { useState, useEffect } from "react";

import {
  coordinator,
  Selection,
  DuckDBWASMConnector,
} from "@uwdata/mosaic-core";
import { loadCSV } from "@uwdata/mosaic-sql";
import * as vg from "@uwdata/vgplot";

import { ScatterPlot } from "./ScatterPlot";

import { Histogram } from "./Histogram";
import { BarChart } from "./BarChart";
import OmeSpinner from "./OmeSpinner";

export const TABLE_NAME = "my_table";

const plotStyle = {
  float: "left",
  margin: "10px",
  padding: "10px",
  borderRadius: "10px",
  background: "#fff",
  position: "relative",
}

function Mosaic(props) {

  const { tableUrl, setSelection, selection, plots, setPlots } = props;

  function removePlot(plotId) {
    setPlots(plots.filter((p) => p.plotId !== plotId));
  }

  // when this component mounts, set up the mosaic environment...
  useEffect(() => {
    async function setupMosaic() {
      console.log("Setting up Mosaic...");

      // set up DuckDB connector
      const wasm = new DuckDBWASMConnector({ log: false });
      coordinator().databaseConnector(wasm);

      await vg
        .coordinator()
        .exec([loadCSV(TABLE_NAME, tableUrl)]);

      const newSelection = Selection.intersect();
      // trigger a re-render with the new selection
      setSelection(newSelection);

      // debug - html table output
      let html = vg.table({
        from: TABLE_NAME,
        filterBy: newSelection,
        height: 300,
        width: 1000,
      });
      console.log("html:", html);
    }
    setupMosaic();
  }, [tableUrl]);

  return (
    <>
      {/* Show spinner while DuckDB loads... */}
      {!selection && <OmeSpinner />}

      {plots.map((plotConfig, index) => 
        {if (plotConfig.type == 'scatter') {
          return (
            <div style={plotStyle} key={plotConfig.plotId}>
              <ScatterPlot //! 
                coordinator={coordinator()}
                table={TABLE_NAME}
                selection={selection}
                xAxis={plotConfig.xAxis}
                yAxis={plotConfig.yAxis}
                plotId={plotConfig.plotId}
                removePlot={removePlot}
              />
            </div>
        )} else if (plotConfig.type == 'histogram') {
          return (
            <div style={plotStyle} key={plotConfig.plotId}>
              <Histogram //! 
                coordinator={coordinator()}
                table={TABLE_NAME}
                selection={selection}
                xAxis={plotConfig.xAxis}
                plotId={plotConfig.plotId}
                removePlot={removePlot}
              />
            </div>
        )} else if (plotConfig.type == 'bar') {
          return (
            <div style={plotStyle} key={plotConfig.plotId}>
              <BarChart //! 
                coordinator={coordinator()}
                table={TABLE_NAME}
                selection={selection}
                yAxis={plotConfig.yAxis}
                plotId={plotConfig.plotId}
                removePlot={removePlot}
              />
            </div>
          )}
        }
      )}
    </>
  );
}

export default Mosaic;
