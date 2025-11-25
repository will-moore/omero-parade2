import * as vg from "@uwdata/vgplot";
import { useEffect, useRef } from "react";

export function FooterTable(props) {
  const { coordinator, table, selection } = props;

  const myRef = useRef(null);

  useEffect(() => {
    if (!selection) {
      return;
    }

    let tableElement = vg.table({
      from: table,
      filterBy: selection,
      height: 300,
      width: 2000,
    });

    myRef.current.innerHTML = "";
    myRef.current.appendChild(tableElement);

    return () => {
      if (!selection) {
        return;
      }
      // Remove this table from mosaic selection
      let toRemove = selection.clauses.filter((c) => {
        return c.source.mark.plot.attributes.style.id === plotId;
      });
      if (toRemove.length > 0) {
        selection.reset(toRemove);
      }
    };
  }, [coordinator, table, selection]);

  return (
    <>
      <div style={{ width: "400px" }} ref={myRef}></div>
    </>
  );
}
