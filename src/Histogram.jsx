// import { makeClient } from "@uwdata/mosaic-core";
// import { count, Query } from "@uwdata/mosaic-sql";
import * as vg from "@uwdata/vgplot";
import { useState, useEffect, useRef } from "react";

/** Show the number of rows in the table.
 * If a `selection` is provided, show the filtered number of rows as well. */
export function Histogram(props) {
  const { coordinator, table, selection, xAxis, yAxis, plotId, removePlot } =
    props;

  const myRef = useRef(null);

  //   const [totalCount, setTotalCount] = useState(null);
  //   const [filteredCount, setFilteredCount] = useState(null);
  //   const [isError, setIsError] = useState(false);
  //   const [isPending, setIsPending] = useState(false);
    function histogram(
        table_name, 
        selection, 
        xaxis, 
        width, 
        height, 
        plotId
    ) {
    return vg.plot(
        vg.rectY(vg.from(table_name, { filterBy: selection }), {
        x: vg.bin(xaxis),
        y: vg.count(),
        fill: "darkorange",
        insetLeft: 0.5,
        insetRight: 0.5,
        }),
        vg.intervalX({ as: selection }),
        vg.xDomain(vg.Fixed),
        vg.xLabel(xaxis),
        vg.xLabelAnchor("center"),
        vg.width(width),
        vg.height(height),
        vg.style({ id: plotId })
    );
    }

  useEffect(() => {
    let plotElement = histogram(
      table,
      selection,
      xAxis,
      500,
      300,
      plotId
    );

    myRef.current.innerHTML = "";
    myRef.current.appendChild(plotElement);

    return () => {
      console.log("Cleaning up histogram...");
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