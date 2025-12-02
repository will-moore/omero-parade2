import { makeClient } from "@uwdata/mosaic-core";
import { count, Query } from "@uwdata/mosaic-sql";
import { useState, useEffect } from "react";

/** Show the number of rows in the table.
 * Example from https://idl.uw.edu/mosaic/web-clients/ 
 * If a `selection` is provided, show the filtered number of rows as well. */
export default function SidePanel(props) {
  const { selectedRows } = props;

  if (selectedRows.length == 1) {

    return (

      <div style={{height: "200px"}}>
        
        {Object.entries(selectedRows[0]).map(([key, value]) => {
          return(<div class="detail">
            <p><strong>{key}:</strong>
              {value}</p>
          </div>
          );
        })}
      </div>
    );
  }else{
    return (
      <div>{selectedRows.length} selected objects</div>
    )
  }

}