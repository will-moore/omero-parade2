// import { makeClient } from "@uwdata/mosaic-core";
// import { count, Query } from "@uwdata/mosaic-sql";
import * as vg from "@uwdata/vgplot";
import { useState, useEffect, useRef } from "react";

/** Show the number of rows in the table.
 * If a `selection` is provided, show the filtered number of rows as well. */
export function ScatterPlot(props) {
  const { coordinator, table, selection, xAxis, yAxis, plotId, removePlot } =
    props;

  const myRef = useRef(null);

  //   const [totalCount, setTotalCount] = useState(null);
  //   const [filteredCount, setFilteredCount] = useState(null);
  //   const [isError, setIsError] = useState(false);
  //   const [isPending, setIsPending] = useState(false);

  function scatterPlot(
    table_name,
    selection,
    xaxis,
    yaxis,
    width,
    height,
    plotId
  ) {
    return vg.plot(
      vg.dot(vg.from(table_name), {
        x: xaxis,
        y: yaxis,
        tip: true,
        fill: "steelblue",
        fillOpacity: 0.8,
        r: 2,
      }),
      vg.highlight({ by: selection, opacity: 0.1, fill: "grey", r: 3 }),
      vg.intervalXY({ as: selection }),
      vg.xyDomain(vg.Fixed),
      vg.width(width),
      vg.height(height),
      vg.style({ id: plotId })
    );
  }

  useEffect(() => {
    let plotElement = scatterPlot(
      table,
      selection,
      xAxis,
      yAxis,
      500,
      300,
      plotId
    );

    myRef.current.innerHTML = "";
    myRef.current.appendChild(plotElement);

    return () => {
      console.log("Cleaning up ScatterPlot...");
      // Remove this plot element from mosaic selection
      let toRemove = selection.clauses.filter((c) => {
        return c.source.mark.plot.attributes.style.id === plotId;
      });
      console.log("toRemove", toRemove);
      if (toRemove.length > 0) {
        selection.reset(toRemove);
        console.log("new selection", selection.clauses);
      }
    };
  }, [coordinator, table, selection]);

  return (
    <>
      <button
        onClick={() => {
          removePlot(plotId);
        }}
      >
        Remove Plot
      </button>
      <div ref={myRef}></div>
    </>
  );
}
