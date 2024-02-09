import express from "express";

export const configBodyParse = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
}