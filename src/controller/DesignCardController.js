// import { designCardById } from "../services/DesignCardServices";
import designCardRepository from "../services/DesignCardServices";

// export const getDesignCardById = async (req, res) => {
//   let data = await designCardById(req.params.id);
//   return res.status(data.status).json(data);
// };

exports.createDesignCard = async (req, res) => {
  let data = await designCardRepository.createDesignCard(req.body);
  return res.status(data.status).json(data);
};
