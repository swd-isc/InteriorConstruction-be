import cors from "cors";

export const configCORS = (app) => {
    app.use(cors());
}