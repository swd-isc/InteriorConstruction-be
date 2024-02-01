import morgan from "morgan"

export const configLog = (app) => {
    app.use(morgan('combined'));
}