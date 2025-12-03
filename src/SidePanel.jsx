import { useState } from "react";
import {getThumbnailUrl} from "./Thumbnail";

/** Show the number of rows in the table.
 * Example from https://idl.uw.edu/mosaic/web-clients/ 
 * If a `selection` is provided, show the filtered number of rows as well. */
export default function SidePanel(props) {
  const { selectedRows } = props;
  const ROW_ID = "File Path";

  const [imageUrl, setImageUrl] = useState(
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  );

  if (selectedRows.length == 1) {
    
    getThumbnailUrl(selectedRows[0]).then((url) => setImageUrl(url)) 

    return (

      <div style={{height: "200px"}}>
        <img
        src={imageUrl}
        alt="Thumbnail"
        style={{
            borderRadius: "10px",
            width: "100%",
            maxHeight: "500px",
            display: "block",
            marginBottom: "20px",
        }}
      />

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