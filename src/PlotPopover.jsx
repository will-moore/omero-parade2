import { makeClient } from "@uwdata/mosaic-core";
import { count, Query } from "@uwdata/mosaic-sql";
import { useState, useEffect, useRef  } from "react";
// import { scatterPlot, barChart, histogram} from "@uwdata/mosaic-core";

export function AddPlot(props) {
  const { coordinator, table, selection, addPlot } = props;

  const [numberColNames, setNumberColNames] = useState([]);
  const [stringColNames, setStringColNames] = useState([]);

  const syles = {
    button: {
      border: "1px solid rgb(51, 51, 51)",
      borderRadius: "10px",
      padding: "5px",
      fontSize: "14px",
      margin: "5px 10px",
    },
  };

  useEffect(() => {
    // Note that the identity of `table` and `selection` is captured below.
    // If they are replaced with a new instances, the client will get recreated as well.

    const client = makeClient({
      coordinator,
      selection,
      prepare: async () => {
        // We setup the <select> elements with column names...
        coordinator.query("describe " + table).then((data) => {
          let col_info = data.toArray();
          console.log("col_info", col_info);
          let number_col_names = col_info
            .filter(
              (d) => d.column_type === "BIGINT" || d.column_type === "DOUBLE"
            )
            .map((d) => d.column_name);
          setNumberColNames(number_col_names);
          let string_col_names = col_info
            .filter((d) => d.column_type === "VARCHAR")
            .map((d) => d.column_name);
          setStringColNames(string_col_names);
        });
      },
      query: (predicate) => {
        console.log("AddPlot query()", predicate);
        // We don't actually need to run any queries here....
        // But IF we don't implement this, we get "null" errors.
        return Query.from(table).select({ count: count() }).where(predicate);
      },
    });

        return () => {
        // Destroy the client on effect cleanup.
        client.destroy();
        };
    }, [coordinator, table, selection]);



    
    return (
    <>
    {/* Popover Button */}
    <div id="controls" className="hidden">
      <h1 style={{margin: "0 20px", fontSize: "27px", fontWeight: "200"}}>Parade</h1>
      <button popoverTarget="addPlotDialog">Add Plot</button>
      <div style={{flexGrow: "1"}}></div>
    </div>

    {/* Popover */}
    <div id="addPlotDialog" popover="auto" className="popover">
      <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
        <h2>Add Plot</h2>
        <button popoverTarget="addPlotDialog" className="x">×</button>
        <div style={{margin: "0", padding: "15px", flex: "1 1 auto"}}>

          {/* tabs (CSS only, no JavaScript) for Plot, Histogram, and Bar Chart */}
          <ul className="tabs">
            <li className="tab">
              <input type="radio" name="tabs" defaultChecked="checked" id="tab1" />
              <label htmlFor="tab1">Scatter Plot</label>
              <div id="tab-content1" className="content">
                <p>
                  <label htmlFor="xaxis">X-axis:</label>
                  <select id="xaxis">
                    {numberColNames.map((colName) => (
                    <option key={colName} value={colName}>
                        {colName}
                    </option>
                    ))}
                  </select>
                  <label htmlFor="yaxis">Y-axis:</label>
                  <select id="yaxis">
                    {numberColNames.map((colName) => (
                    <option key={colName} value={colName}>
                        {colName}
                    </option>
                    ))}
                  </select>
                </p>
                <p style={{textAlign: "right"}}>
                    <button
                        style={syles.button}
                        onClick={() => {
                        let plotId = `scatter-plot-${Date.now()}`;
                        const xAxis = document.getElementById("xaxis").value;
                        const yAxis = document.getElementById("yaxis").value;
                        addPlot({ xAxis, yAxis, plotId, type: "scatter" });
                        }}
                    >
                        Add Plot
                    </button>
                </p>
              </div>
            </li>

            <li className="tab">
              <input type="radio" name="tabs" id="tab2" />
              <label htmlFor="tab2">Histogram</label>
              <div id="tab-content2" className="content">
                <p>
                  <label htmlFor="histogramAxis">X-axis:</label>
                  <select id="histogramAxis">
                    {numberColNames.map((colName) => (
                    <option key={colName} value={colName}>
                        {colName}
                    </option>
                    ))}
                  </select>
                </p>
                <p style={{textAlign: "right"}}>
                    <button
                        style={syles.button}
                        onClick={() => {
                        let plotId = `histogram-${Date.now()}`;
                        const xAxis = document.getElementById("histogramAxis").value;
                        addPlot({ xAxis, plotId, type: "histogram" });
                        }}
                    >
                        Add Plot
                    </button>
                </p>
              </div>
            </li>

            <li className="tab">
              <input type="radio" name="tabs" id="tab3" />
              <label htmlFor="tab3">Bar Chart</label>
              <div id="tab-content3" className="content">
                <p>
                  <label htmlFor="stringCols">Column:</label>
                  <select id="stringCols">
                    {stringColNames.map((colName) => (
                    <option key={colName} value={colName}>
                        {colName}
                    </option>
                    ))}
                  </select>
                </p>
                <p style={{textAlign: "right"}}>
                    <button
                        style={syles.button}
                        onClick={() => {
                        let plotId = `bar-chart-${Date.now()}`;
                        const yAxis = document.getElementById("stringCols").value;
                        addPlot({ yAxis, plotId, type: "bar" });
                        }}
                    >
                        Add Plot
                    </button>
                </p>
              </div>
            </li>
            </ul>
        </div>
          
        <div style={{flexGrow: "1"}}></div>
        <div style={{margin: "0", padding: "15px", borderTop: "solid grey 1px", textAlign: "right"}}>
          <button popoverTarget="addPlotDialog" className="close">Close</button>
        </div>
      </div>
    </div>
    </>    
    )
}