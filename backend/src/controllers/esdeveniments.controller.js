const pool = require('../db');

const toDateOrNull = (value) => {
    if (!value || value === "") return null;
    return value;
};

const createEsdeveniment = async (req, res) => {
    
};

const getEsdevenimentInfo = async (req, res) => {
    
};

const modifyEsdeveniment = async (req, res) => {
    
};

const getFutureEsdeveniments = async (req, res) => {
    
};

const getPastEsdeveniments = async (req, res) => {
    
};

module.exports = {
    createEsdeveniment, getEsdevenimentInfo, modifyEsdeveniment, 
    getFutureEsdeveniments, getPastEsdeveniments
};