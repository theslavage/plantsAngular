
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Импортируем твои маршруты
import plantRoutes from "../backend/routes/plantRoutes.js"; // пример пути, проверь у себя
import userRoutes from "../backend/routes/userRoutes.js";   // если есть

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Роуты
app.use("/api/plants", plantRoutes);
app.use("/api/users", userRoutes);

// Обёртка для Vercel
export default app;
