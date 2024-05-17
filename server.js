import express from 'express';
import roomRoutes from './routes/roommatesRoutes.js';
import spentRoutes from './routes/gastosRoutes.js';
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());


//Routes
app.use('/', roomRoutes)
app.use('/', spentRoutes)


app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));