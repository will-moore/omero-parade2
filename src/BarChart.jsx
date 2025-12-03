// import { makeClient } from "@uwdata/mosaic-core";
// import { count, Query } from "@uwdata/mosaic-sql";
import * as vg from "@uwdata/vgplot";
import { useState, useEffect, useRef } from "react";

/** Show the number of rows in the table.
 * If a `selection` is provided, show the filtered number of rows as well. */
export function BarChart(props) {
  const { coordinator, table, selection, click, barAxisWidth, xAxis, yAxis, plotId, removePlot } =
    props;

  const myRef = useRef(null);

  //   const [totalCount, setTotalCount] = useState(null);
  //   const [filteredCount, setFilteredCount] = useState(null);
  //   const [isError, setIsError] = useState(false);
  //   const [isPending, setIsPending] = useState(false);

    function barChart(
    table_name, 
    selection, 
    click,
    barAxisWidth,
    yaxis, 
    width, 
    height, 
    plotId
    ) {

    return vg.plot(
        // This rule is just there to be able to click-expand the x-axis
        // It was tied to the highlight, but that's not clickable if the bar is too small
        vg.ruleY(
          vg.from(table_name),                    
          {
            y: yaxis,
            stroke: "black",
            strokeWidth: 250,                     
            strokeOpacity: 0.0001,                
            pointerEvents: "stroke"               
          }
        ),
        vg.toggleY({ as: barAxisWidth }),

        vg.barX(
          vg.from(table_name, {filterBy: barAxisWidth}),
          {x: vg.count(), y: yaxis, fill: "#ccc", fillOpacity: 0.2}
        ),
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
        vg.toggleY({as: click}),
        vg.highlight({by: click, opacity: 0.1, fill: "grey", r: 3}),
        // vg.xyDomain(vg.Fixed),
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
      click,
      barAxisWidth,
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
  }, [coordinator, table, selection, click, barAxisWidth]);

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
