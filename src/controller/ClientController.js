import { clientRepository } from "../services/ClientServices";

export const clientService = {
  getClients: async (req, res) => {
    let data = await clientRepository.getClients(
      req.query.sort_by,
      req.query.page
    );
    return res.status(data.status).json(data);
  },

  getClientById: async (req, res) => {
    let data = await clientRepository.getClientById(req.params.id);
    return res.status(data.status).json(data);
  },

  createClient: async (req, res) => {
    let data = await clientRepository.createClient(req.body);
    return res.status(data.status).json(data);
  },

  updateClient: async (req, res) => {
    let data = await clientRepository.updateClient(req.params.id, req.body);
    return res.status(data.status).json(data);
  },

  deleteClient: async (req, res) => {
    let data = await clientRepository.deleteClient(req.params.id);
    return res.status(data.status).json(data);
  },
};
