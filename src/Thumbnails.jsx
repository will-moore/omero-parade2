import { makeClient } from "@uwdata/mosaic-core";
import { column, count, Query } from "@uwdata/mosaic-sql";
import { useState, useEffect } from "react";
import { Grid } from "react-window";

import Thumbnail from "./Thumbnail";

const columnCount = 10;
const columnWidth = 90;

export default function MosaicCount(props) {
  const { coordinator, table, selection, setSelectedRows, selectedRows } = props;
 
  // const [totalCount, setTotalCount] = useState(null);
  const [rowsToDisplay, setRowsToDisplay] = useState([]);
  const ROW_ID = "File Path";

  function onClick(event, row){
      console.log("Selected rows length "+selectedRows.length)
      let url = row[ROW_ID];
      let selectedIDs = selectedRows.map(r => r[ROW_ID])
      if (selectedIDs.includes(url)) {
        // toggle selection off if already selected...
        setSelectedRows(selectedRows.filter((d) => d[ROW_ID] !== url));

      } else {
        // if Cmd or Ctrl key held, allow multi-select
        if (!event.metaKey && !event.ctrlKey) {
          // no modifier key, so
          // de-select all others and select this one...
          setSelectedRows([row]);
        } else {
          // OR: allow multiple selection...
          setSelectedRows([...selectedRows, row]);
        }
      }
  }

  useEffect(() => {
    if (!selection) {
      return;
    }

    const client = makeClient({
      coordinator,
      selection,
      prepare: async () => {
        // For now, select EVERYTHING and pass a whole row to each Thumbnail.
        // This is inefficient, but simpler for now.
        let rowData = await coordinator.query(
          Query.from(table).select("*")
        );
        setRowsToDisplay(rowData.toArray());
        // Alternatively, get the total count of rows - and let each Thumbnail be a "client" 
        // and fetch its own data from the table.
        // const result = await coordinator.query(
        //   Query.from(table).select({ count: count() })
        // );
        // setTotalCount(result.get(0).count);
      },
      query: (predicate) => {
        return Query.from(table).select("*").where(predicate);
      },
      queryResult: (data) => {
        setRowsToDisplay(data.toArray());
      },
      queryPending: () => {
        // Clear selected images when a new query is pending...
        setSelectedRows([]);
      },
      queryError: () => {
        // There is an error running the query.
      },
    });

    return () => {
      // Destroy the client on effect cleanup.
      client.destroy();
    };
  }, [coordinator, table, selection]);

  return (
    <div style={{ height: "250px" }}>
      Thumbnails ({rowsToDisplay.length}, rows: {Math.ceil(rowsToDisplay.length / columnCount)} ):
      <Grid
        cellComponent={Thumbnail}
        cellProps={{ rowsToDisplay, setSelectedRows, selectedRows, columnCount: columnCount, onClick }}
        columnCount={columnCount}
        columnWidth={columnWidth}
        rowCount={Math.ceil(rowsToDisplay.length / columnCount)}
        rowHeight={columnWidth}
      />
    </div>
  );
}
