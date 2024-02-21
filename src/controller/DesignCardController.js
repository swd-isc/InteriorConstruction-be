import { designCardRepository } from "../services/DesignCardServices";

export const designCardService = {
  getDesignCards: async (req, res) => {
    let data = await designCardRepository.getDesignCards(
      req.query.sort_by,
      req.query.page
    );
    return res.status(data.status).json(data);
  },

  getDesignCardById: async (req, res) => {
    let data = await designCardRepository.getDesignCardById(req.params.id);
    return res.status(data.status).json(data);
  },

  createDesignCard: async (req, res) => {
    let data = await designCardRepository.createDesignCard(req.body);
    return res.status(data.status).json(data);
  },

  updateDesignCard: async (req, res) => {
    let data = await designCardRepository.updateDesignCard(
      req.params.id,
      req.body
    );
    return res.status(data.status).json(data);
  },

  deleteDesignCard: async (req, res) => {
    let data = await designCardRepository.deleteDesignCard(req.params.id);
    return res.status(data.status).json(data);
  },
};
