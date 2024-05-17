import express from "express";
import {
    getGastos,
    addGasto,
    deleteGasto,
    editGasto
} from "../controller/gastosController.js";
const router = express.Router();

router.get("/gastos", getGastos);

router.post("/gasto", addGasto);

router.delete("/gasto", deleteGasto);

router.put("/gasto", editGasto);

export default router;