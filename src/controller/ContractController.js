import { contractRepository } from "../services/ContractServices";

export const contractService = {
  getContracts: async (req, res) => {
    let data = await contractRepository
      .getContracts
      // req.query.sort_by,
      // req.query.page,
      // req.query.clientId
      ();
    return res.status(data.status).json(data);
  },

  getContractsByClientId: async (req, res) => {
    let data = await contractRepository.getContractsByClientId(req.user);
    return res.status(data.status).json(data);
  },

  getContractById: async (req, res) => {
    let data = await contractRepository.getContractById(req.params.id, req.user);
    return res.status(data.status).json(data);
  },

  createContract: async (req, res) => {
    let data = await contractRepository.createContract(req.body);
    return res.status(data.status).json(data);
  },

  updateContract: async (req, res) => {
    let data = await contractRepository.updateContract(
      req.params.id,
      req.body,
      req.user
    );
    return res.status(data.status).json(data);
  },

  deleteContract: async (req, res) => {
    let data = await contractRepository.deleteContract(req.params.id);
    return res.status(data.status).json(data);
  },
};
