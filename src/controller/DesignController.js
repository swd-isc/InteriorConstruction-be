import designRepository from "../services/DesignServices";

exports.getDesigns = async (req, res) => {
  let data = await designRepository.getDesigns(
    req.query.sort_by,
    req.query.page
  );
  return res.status(data.status).json(data);
};

exports.getDesignById = async (req, res) => {
  let data = await designRepository.getDesignById(req.params.id);
  return res.status(data.status).json(data);
};

exports.createDesign = async (req, res) => {
  let data = await designRepository.createDesign(req.body);
  return res.status(data.status).json(data);
};
