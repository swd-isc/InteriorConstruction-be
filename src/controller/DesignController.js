import { designRepository } from "../services/DesignServices";

export const designService = {
  getDesigns: async (req, res) => {
    let data = await designRepository.getDesigns(
      req.query.sort_by,
      req.query.page,
      req.query.classificationId,
    );
    return res.status(data.status).json(data);
  },

  getDesignsForAdmin: async (req, res) => {
    let data = await designRepository.getDesignsForAdmin(
      req.query.sort_by,
      req.query.page,
      req.query.type
    );
    return res.status(data.status).json(data);
  },

  getDesignById: async (req, res) => {
    let data = await designRepository.getDesignById(req.params.id);
    return res.status(data.status).json(data);
  },

  getDesignByIdForAdmin: async (req, res) => {
    let data = await designRepository.getDesignByIdForAdmin(req.params.id);
    return res.status(data.status).json(data);
  },

  createDesign: async (req, res) => {
    let data = await designRepository.createDesign(req.body);
    return res.status(data.status).json(data);
  },

  updateDesign: async (req, res) => {
    let data = await designRepository.updateDesign(req.params.id, req.body);
    return res.status(data.status).json(data);
  },

  deleteDesign: async (req, res) => {
    let data = await designRepository.deleteDesign(req.params.id);
    return res.status(data.status).json(data);
  },
};
