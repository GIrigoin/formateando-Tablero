import { readFileSync, writeFileSync } from "node:fs";

const rawData = readFileSync(
  "./Seguimiento busqueda laboral - 1726154497937.csv"
);
const data = rawData.toString();
const rows = data.split("\n");

// Fecha , Nombre de la Empresa , Link de la Vacante , Comentarios

let procesedRows = rows.map((row, index) => {
  //la cabecera queda igual
  if (index === 0) return row;
  let cells = row.split(",");

  //Procesar la fecha a un formato corto
  const fecha = new Date(cells[0]);
  let date = `${fecha.getDate()}/${
    fecha.getMonth() + 1
  }/${fecha.getFullYear()}`;
  cells[0] = date;

  //Si el nombre tiene un NO y fecha sacarlos y añadirlos a Comentario (cells[3]), sino
  const startIndex = cells[1].lastIndexOf("NO");
  if (startIndex >= 0) {
    cells[3] = cells[1].slice(startIndex);
    cells[1] = cells[1].slice(0, startIndex);
  } else cells[3] = "Postulación Activa";

  //La celda del link tiene informacion duplicada.
  let regex = /\[(.*?)\]/g;
  let matches = [];
  let match;

  while ((match = regex.exec(cells[2])) !== null) {
    matches.push(match[1]);
  }
  if (matches.length > 0) cells[2] = matches[0];

  //Recombinar los datos de salida en un string

  return cells.join(",");
});

const processedData = procesedRows.join("\n");

writeFileSync("./Seguimiento Procesado.csv", processedData);

// console.log(processedData);
