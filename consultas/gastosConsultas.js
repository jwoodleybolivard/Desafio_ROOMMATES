import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { recalcularDeudas } from "../consultas/roommatesConsultas.js";

const getGastosQuery = async () => {
    try {
        const gastosJson = JSON.parse(fs.readFileSync("./data/gastos.json", "utf-8"));
        return gastosJson;
    } catch (error) {
        if (error.code === "ENOENT") {
            console.log("El archivo gastos.json no existe, creando uno...");
            fs.writeFileSync("./data/gastos.json", JSON.stringify({ gastos: [] }));
            console.log("Archivo creado exitosamente");
        } else {
            console.log(error);
        }
    }
};

const addGastoQuery = async (gasto) => {
    try {
        gasto.fecha = new Date();
        gasto.id = uuidv4().slice(0, 8);
        const gastosJson = await getGastosQuery();
        gastosJson.gastos.push(gasto);
        fs.writeFileSync("./data/gastos.json", JSON.stringify(gastosJson));
    } catch (error) {
        console.log(error);
    }
};

const deleteGastoQuery = async (id) => {
    try {
        const gastosJSON = await fs.readFileSync("data/gastos.json", "utf8");
        let { gastos } = JSON.parse(gastosJSON);
        gastos = gastos.filter((g) => g.id !== id);
        await fs.writeFileSync("data/gastos.json", JSON.stringify({ gastos }));
    } catch (error) { }
};

const editGastoQuery = async (id, gasto) => {
    try {
        const gastosJSON = await fs.readFileSync("data/gastos.json", "utf8");
        let { gastos } = JSON.parse(gastosJSON);
        gastos = gastos.map((g) => {
            if (g.id == id) {
                const newData = gasto;
                newData.id = id;
                return newData;
            }
            return g;
        });
        await fs.writeFileSync("data/gastos.json", JSON.stringify({ gastos }));
        await recalcularDeudas();
    } catch (error) { }
};

export { getGastosQuery, addGastoQuery, deleteGastoQuery, editGastoQuery };
