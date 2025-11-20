import { useState, useEffect, useRef } from "react";
import { fetchJson, filesizeformat } from "./utils";

// For testing, a default CSV source...
const TEST_TABLE = `https://raw.githubusercontent.com/will-moore/ome2024-ngff-challenge/refs/heads/biofile_finder_csvs/samples/idr0010_images_bff.csv`;

function TableChooser(props) {
  const { setTableUrl } = props;

  const dialogRef = useRef(null);

  const params = new URLSearchParams(window.location.search);

  // We check for an OMERO object to load the table from...
  const datasetId = params.get("dataset");
  const screenId = params.get("screen");
  const plateId = params.get("plate");
  const projectId = params.get("project");
  const csv = params.get("csv");

  // dialog state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [loading, setLoading] = useState(false);
  const [fileAnns, setFileAnns] = useState([]);
  const [selectedAnn, selectFileAnn] = useState(undefined);
  const [datasets, setDatasets] = useState(
    projectId === "" ? undefined : projectId
  );
  const [mapAnns, setMapAnns] = useState(undefined);
  const [tags, setTags] = useState(undefined);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedAnn) {
      let fileAnn = fileAnns.filter((fa) => fa.id == selectedAnn)[0];

      console.log("FILE ANN:", fileAnn);
      // window.location.href = `${origin}?csv=${csvUrl}`;

      let csvUrl = "";

      if (fileAnn.file.name.endsWith("csv")) {
        // dataToLoad.csvFiles = [selectedAnn];
        csvUrl = window.OMEROWEB_INDEX + `webclient/annotation/${fileAnn.id}/`;
      } else {
        // dataToLoad.tables = [fileAnn.file.id];
        csvUrl =
          window.OMEROWEB_INDEX +
          `webclient/omero_table/${fileAnn.file.id}/csv/`;
      }
      console.log("CSV URL:", csvUrl);
      let origin = window.location.origin + window.location.pathname;
      window.location.href = `${origin}?csv=${csvUrl}`;
    }
  };

  useEffect(() => {
    let annUrl = null;
    async function initLoad() {
      if (window.OMEROWEB_INDEX) {
        let url =
          window.OMEROWEB_INDEX + `webclient/api/annotations/?type=file`;
        if (projectId) {
          annUrl = url + `&project=${projectId}`;
        } else if (datasetId) {
          annUrl = url + `&dataset=${datasetId}`;
        } else if (plateId) {
          annUrl = url + `&plate=${plateId}`;
        } else if (screenId) {
          annUrl = url + `&screen=${screenId}`;
        }
        // else if (csv) {
        //   url = csv;
        //   if (url.includes("/webclient/")) {
        //     window.OMEROWEB_INDEX = url.split("webclient")[0];
        //   }
        // }
      }

      console.log("annUrl:", annUrl, " csv:", csv);

      if (!annUrl && !csv) {
        // If NO data in URL, user can choose default csv from IDR...
        let csvUrl = prompt(
          "Need ?project=ID or ?screen=ID etc or csv=https://full/server/csv/url/ Use this example?",
          TEST_TABLE
        );
        // We do a full redirect to set the URL properly...
        let origin = window.location.origin + window.location.pathname;
        if (csvUrl) {
          window.location.href = `${origin}?csv=${csvUrl}`;
        }
        return;
      }

      // await initCorsHeaders(window.OMEROWEB_INDEX);

      // URL is ?csv=... Open directly (no dialog)
      if (csv) {
        setTableUrl(csv);
        return;
      }

      // If we have an annUrl, open the dialog to choose file annotation
      dialogRef.current.showModal();

      setLoading(true);

      fetchJson(annUrl).then((data) => {
        setLoading(false);
        let csvFiles = data.annotations.filter((ann) => {
          // return csv files and OMERO.tables
          return (
            ann.file &&
            (ann.file.name.endsWith(".csv") ||
              ann.file.mimetype === "OMERO.tables")
          );
        });
        setFileAnns(csvFiles);
      });
    }
    initLoad();
    // eslint-disable-next-line
  }, [projectId, screenId, plateId, datasetId]);

  return (
    <dialog ref={dialogRef}>
      <h1>File Annotations...</h1>

      <form>
        <select onChange={(e) => selectFileAnn(e.target.value)}>
          <option value="">-- select file annotation --</option>
          {fileAnns.map((ann) => (
            <option key={ann.id} value={ann.id}>
              {`${ann.file.name} (${filesizeformat(ann.file.size)})`}
            </option>
          ))}
        </select>
        selectedAnn: {selectedAnn}
        <button onClick={handleSubmit} value="submit">
          Load Selected Table
        </button>
      </form>

      <form method="dialog">
        <button>Close</button>
      </form>
    </dialog>
  );
}

export default TableChooser;
