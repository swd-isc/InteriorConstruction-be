import { requestRepository } from "../services/RequestServices";

export const requestService = {
  getRequests: async (req, res) => {
    let data = await requestRepository.getRequests();
    return res.status(data.status).json(data);
  },

  getRequestById: async (req, res) => {
    let data = await requestRepository.getRequestById(req.params.id);
    return res.status(data.status).json(data);
  },

  getRequestsByClientId: async (req, res) => {
    let data = await requestRepository.getRequests(req.params.id);
    return res.status(data.status).json(data);
  },

  createRequest: async (req, res) => {
    let data = await requestRepository.createRequest(req.body);
    return res.status(data.status).json(data);
  },

  updateRequest: async (req, res) => {
    let data = await requestRepository.updateRequest(req.params.id, req.body);
    return res.status(data.status).json(data);
  },

  deleteRequest: async (req, res) => {
    let data = await requestRepository.deleteRequest(req.params.id);
    return res.status(data.status).json(data);
  },
};
