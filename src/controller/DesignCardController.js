import { designCardRepository } from "../services/DesignCardServices";

export const designCardService = {
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
};
