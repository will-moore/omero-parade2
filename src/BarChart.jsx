// import { makeClient } from "@uwdata/mosaic-core";
// import { count, Query } from "@uwdata/mosaic-sql";
import * as vg from "@uwdata/vgplot";
import { useState, useEffect, useRef } from "react";

/** Show the number of rows in the table.
 * If a `selection` is provided, show the filtered number of rows as well. */
export function BarChart(props) {
  const { coordinator, table, selection, xAxis, yAxis, plotId, removePlot } =
    props;

  const myRef = useRef(null);

  //   const [totalCount, setTotalCount] = useState(null);
  //   const [filteredCount, setFilteredCount] = useState(null);
  //   const [isError, setIsError] = useState(false);
  //   const [isPending, setIsPending] = useState(false);

    function barChart(
    table_name, 
    selection, 
    yaxis, 
    width, 
    height, 
    plotId
    ) {
    return vg.plot(
        vg.barX(
        vg.from(table_name, {filterBy: selection}),
        {
            x: vg.count(),
            y: yaxis,
            fill: "darkgreen",
            sort: {y: "-x", limit: 20}
        }
        ),
        vg.toggleY({ as: selection }),
        vg.xyDomain(vg.Fixed),
        vg.xLabel("Count"),
        vg.yLabel(yaxis),
        vg.yLabelAnchor("top"),
        vg.marginTop(15),
        vg.width(width),
        vg.height(height),
        vg.style({ id: plotId })
    )
    }

  useEffect(() => {
    let plotElement = barChart(
      table,
      selection,
      yAxis,
      500,
      300,
      plotId
    );

    myRef.current.innerHTML = "";
    myRef.current.appendChild(plotElement);

    return () => {
      console.log("Cleaning up BarChart...");
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
