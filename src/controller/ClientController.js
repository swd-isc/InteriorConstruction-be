import clientRepository from "../services/ClientServices";

exports.getClients = async (req, res) => {
  let data = await clientRepository.getClients(
    req.query.sort_by,
    req.query.page
  );
  return res.status(data.status).json(data);
};

exports.getClientById = async (req, res) => {
  let data = await clientRepository.getClientById(req.params.id);
  return res.status(data.status).json(data);
};

exports.createClient = async (req, res) => {
  let data = await clientRepository.createClient(req.body);
  return res.status(data.status).json(data);
};

exports.updateClient = async (req, res) => {
  let data = await clientRepository.updateClient(req.params.id, req.body);
  return res.status(data.status).json(data);
};

exports.deleteClient = async (req, res) => {
  let data = await clientRepository.deleteClient(req.params.id);
  return res.status(data.status).json(data);
};
