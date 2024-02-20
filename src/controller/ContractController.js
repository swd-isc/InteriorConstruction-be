import contractRepository from "../services/ContractServices"

exports.getContracts = async (req, res) => {
  let data = await contractRepository.getContracts(
    req.query.sort_by,
    req.query.page
  );
  return res.status(data.status).json(data);
};

exports.getContractById = async (req, res) => {
  let data = await contractRepository.getContractById(req.params.id);
  return res.status(data.status).json(data);
};

exports.createContract = async (req, res) => {
  let data = await contractRepository.createContract(req.body);
  return res.status(data.status).json(data);
};

exports.updateContract = async (req, res) => {
  let data = await contractRepository.updateContract(req.params.id, req.body);
  return res.status(data.status).json(data);
};
