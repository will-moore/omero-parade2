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
import { AddPlot } from "./PlotPopover";
import OmeSpinner from "./OmeSpinner";

export const TABLE_NAME = "my_table";

function Mosaic(props) {

  const { tableUrl, setSelection, selection } = props;

  // const [selection, setSelection] = useState(null);
  const [plots, setPlots] = useState([]);

  function addPlot(plotConfig) {
    setPlots([...plots, plotConfig]);
  }

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
      {/* only render when selection is set */}
      {selection ? (
        <div>
          <AddPlot
            coordinator={coordinator()}
            table={TABLE_NAME}
            selection={selection}
            addPlot={addPlot}
          />
        </div>
      ) : <OmeSpinner />}

      {plots.map((plotConfig, index) => 
        {if (plotConfig.type == 'scatter') {
          return (
            <div key={plotConfig.plotId}>
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
            <div key={plotConfig.plotId || index}>
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
            <div key={plotConfig.plotId || index}>
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
