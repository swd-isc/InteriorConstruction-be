import designRepository from "../services/DesignServices"

exports.getDesigns = async (req, res) => {
  let data = await designRepository.getDesigns(req.params.page);
  if (!data.error) {
    return res.status(200).json({
      status: 200,
      data: data,
      message: "OK",
    });
  } else {
    return res.status(500).json({
      status: 500,
      messageError: data.error,
    });
  }
};

exports.getDesignById = async (req, res) => {
  let data = await designRepository.getDesignById(req.params.id);
  if (!data.error) {
    return res.status(200).json({
      status: 200,
      data: data,
      message: "OK",
    });
  } else {
    return res.status(500).json({
      status: 500,
      messageError: data.error,
    });
  }
};
