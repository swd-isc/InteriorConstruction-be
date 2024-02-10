import contractRepository from "../services/ContractServices"

exports.getContracts = async (req, res) => {
  let data = await contractRepository.getContracts(req.params.page);
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

exports.getContractById = async (req, res) => {
  let data = await contractRepository.getContractById(req.params.id);
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
