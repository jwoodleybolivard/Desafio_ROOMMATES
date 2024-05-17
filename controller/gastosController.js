import { getGastosQuery, addGastoQuery, deleteGastoQuery, editGastoQuery } from "../consultas/gastosConsultas.js";
import { recalcularDeudas } from "../consultas/roommatesConsultas.js";


const getGastos = async (req, res) => {
    try {
        const gastosJson = await getGastosQuery()
        res.json(gastosJson)
    } catch (error) {
        console.log(error)
    }
}

const addGasto = async (req, res) => {
    try {
        const gasto = req.body
        if (typeof gasto.monto !== "number") {
            return res.status(400).send("Error: tipo de datos incorrecto");
        }

        await addGastoQuery(gasto)
        recalcularDeudas();
        res.send("Gasto agregado")
    } catch (error) {
        console.log(error)
        res.status(500).send("Error al agregar gasto")
    }
}

const deleteGasto = async (req, res) => {
    try {
        const id = req.query.id

        await deleteGastoQuery(id)
        recalcularDeudas()
        res.send("Gasto eliminado")
    } catch (error) {
        console.log(error)
    }
}

const editGasto = async (req, res) => {
    try {
        const id = req.query.id
        const gasto = req.body
        await recalcularDeudas();
        await editGastoQuery(id, gasto)

        res.send("Gasto editado")
    } catch (error) {
        console.log(error)
    }
}

export {
    getGastos,
    addGasto,
    deleteGasto,
    editGasto
}