const express = require('express');
const { welcome, clientPoint } = require('../service/integracao');
const wpp = express.Router()

wpp.post("/welcome", async (req, res) => {
    const {tel} = req.body;

    const result = await welcome(tel);

    result.success ? res.status(200).json(result) : res.status(500).json(result)
})

wpp.post("/cashback", async (req, res) => {
    const {id} = req.body;

    const result = await clientPoint(id);

    result.success ? res.status(200).json(result) : res.status(500).json(result)
})

module.exports = wpp