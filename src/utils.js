let cors_headers = { mode: "cors", credentials: "include" };

export async function fetchJson(url) {
  return await fetch(url, cors_headers)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("Failed to fetch:", url);
    });
}

export function filesizeformat(bytes, round) {
  /*
    Formats the value like a 'human-readable' file size (i.e. 13 KB, 4.1 MB,
    102 bytes, etc).*/

  if (round === undefined || !isInt(round)) round = 2;

  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(round) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(round) + " MB";
  } else if (bytes < 1024 * 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(round) + " GB";
  } else if (bytes < 1024 * 1024 * 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(round) + " TB";
  } else {
    return (bytes / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(round) + " PB";
  }
}
