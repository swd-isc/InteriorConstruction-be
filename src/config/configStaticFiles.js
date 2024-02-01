const path = require('path');
// const express = require('express');
import express from "express";

const configStaticFiles = (app) => {
    //config static files
    app.use(express.static(path.join('./src', 'public')));
}

export {
    configStaticFiles
}