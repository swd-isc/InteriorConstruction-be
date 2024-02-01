import express from "express";

export const configBodyParse = (app) => {
    app.use(express.json());
}