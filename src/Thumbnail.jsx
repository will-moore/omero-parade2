// Show an image for a given row

import { useState, useEffect } from "react";

import * as omezarr from "https://cdn.jsdelivr.net/npm/ome-zarr.js@latest/+esm";

export default function Thumbnail(props) {
  const { columnIndex, rowIndex, style, rowsToDisplay, columnCount, selectedRows, onClick } = props;

  const index = rowIndex * columnCount + columnIndex;
  if (index >= rowsToDisplay.length) {
    return <div style={style}></div>;
  }

  const row = rowsToDisplay[index];
  console.log("Thumbnail row:", row);

  const [imageUrl, setImageUrl] = useState(
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  );

  useEffect(() => {

    if (row["File Path"]) {
      // E.g. csv from OMERO-Biofile Finder plugin
      if (row["Thumbnail"]) {
        setImageUrl(row["Thumbnail"]);
      } else if (row["File Path"].startsWith("/webclient/")) {
        setImageUrl(row["File Path"]);
      } else {
        // Assume it's a Zarr path...
        omezarr.renderThumbnail(row["File Path"]).then((src) => {
          setImageUrl(src);
        });
      }
    } else {
      let obj_id = null;
      let obj_col = null;
      // Check for ROI ID first, then Image ID...
      for (let imgCol of ["roi_id", "ROI","image_id", "Image", "Image ID"]) {
        console.log("Checking imgCol:", imgCol, row[imgCol]);
        if (row[imgCol] && Number.isInteger(row[imgCol])) {
          obj_id = row[imgCol];
          obj_col = imgCol;
          break;
        }
      }
      if (obj_id) {
        
        const isRoi = (obj_col.toLowerCase().startsWith("roi"))
        let src = `${window.OMEROWEB_INDEX}webgateway/render${ isRoi ? "_roi_" : "_" }thumbnail/${obj_id}/`;
        setImageUrl(src);
      }
    }
  }, [row]);

  return (
    <div style={style}>
      <img

        onClick={(event) => {
          onClick(event, imageUrl)
        }}

        src={imageUrl}
        alt="Thumbnail"
        style={{
          width: "75px",
          height: "75px",
          objectFit: "cover",
          backgroundColor: "#eee",
          boxSizing: "border-box",
          border: selectedRows.includes(imageUrl) ? "5px solid blue" : "0px solid blue"
        }}
      />
    </div>
  );
}
