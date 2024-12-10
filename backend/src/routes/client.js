const express = require('express');
const { clientCreate, clientList, clientSerach, clientDelete, clientUpdate } = require('../service/client');
const client = express.Router();

client.post("/insert", async (req, res) => {
    const {cpf, name, tel} = req.body;

    const result = await clientCreate(cpf, name, tel);

    result.success ? res.status(201).json(result) : res.status(500).json(result);
});

client.get("/all", async (req, res) => {
    const result = await clientList();

    result.success ? res.status(200).json(result) : res.status(500).json(result);
});

client.get("/serach", async (req, res) => {
    const {cpf} = req.query;

    const result = await clientSerach(cpf)

    result.success ? res.status(200).json(result) : res.status(500).json(result)
})

client.delete("/del/:id", async (req, res) => {
    const { id } = req.params;

    const result = await clientDelete(id);

    result.success ? res.status(200).json(result) : res.status(500).json(result)
})

client.put("/update", async (req, res) => {
    const {nome, cpf, tel, id} = req.body;
    const result = await clientUpdate(nome, cpf, tel, id);

    result.success ? res.status(200).json(result) : res.status(500).json(result)
})

module.exports = client 
