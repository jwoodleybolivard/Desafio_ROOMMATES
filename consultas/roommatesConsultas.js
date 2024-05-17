import axios from "axios";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const apiurl = "https://randomuser.me/api/";

const addRoommateQuery = async (req, res) => {
  try {
    const data = await axios.get(apiurl);
    const randomuser = data.data.results[0];

    const id = uuidv4().slice(0, 8);
    const usuario = {
      id,
      nombre: `${randomuser.name.first} ${randomuser.name.last}`,
      email: randomuser.email,
      debe: 0,
      recibe: 0,
    };
    const roommatesJson = JSON.parse(
      fs.readFileSync("./data/roommates.json", "utf-8")
    );
    roommatesJson.roommates.push(usuario);
    fs.writeFileSync("./data/roommates.json", JSON.stringify(roommatesJson));
  } catch (error) {
    console.log(error);
  }
};

const getRoommatesQuery = async () => {
  try {
    const roommatesJson = JSON.parse(fs.readFileSync("./data/roommates.json", "utf-8"));
    return roommatesJson;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("El archivo roommates.json no existe, creando uno.");
      fs.writeFileSync("./data/roommates.json", JSON.stringify({ roommates: [] }));
      console.log("Archivo creado exitosamente");
    } else {
      console.log(error);
    }
  }
};

const recalcularDeudas = () => {
  // Lectura de archivos JSON una sola vez al principio de la función
  const roommatesData = fs.readFileSync("./data/roommates.json", "utf8");
  const gastosData = fs.readFileSync("./data/gastos.json", "utf8");

  const { roommates } = JSON.parse(roommatesData);
  const { gastos } = JSON.parse(gastosData);

  // Inicialización de las deudas y créditos de cada roommate
  roommates.forEach((r) => {
    r.debe = 0;
    r.recibe = 0;
    r.total = 0;
  });

  // Cálculo de deudas y créditos
  gastos.forEach((g) => {
    const montoPorPersona = g.monto / roommates.length;
    roommates.forEach((r) => {
      if (g.roommate === r.nombre) {
        r.recibe += montoPorPersona * (roommates.length - 1);
      } else {
        r.debe -= montoPorPersona;
      }
      r.total = r.recibe - r.debe;
    });
  });

  // Escritura del archivo JSON con los datos actualizados
  fs.writeFileSync("./data/roommates.json", JSON.stringify({ roommates }));
};



export { addRoommateQuery, getRoommatesQuery, recalcularDeudas };