import accountRepository from "../services/AccountServices";

exports.insertSampleData = async (req, res) => {
  let data = await accountRepository.insertSampleData();
  if (!data.error) {
    return res.status(200).json({
      status: 200,
      data: data,
      message: "OK",
    });
  } else {
    return res.status(data.status).json({
      status: data.status,
      messageError: data.error,
    });
  }
};

exports.getAccounts = async (req, res) => {
  let data = await accountRepository.getAccounts(
    req.query.sort_by,
    req.query.page
  );
  return res.status(data.status).json(data);
};

exports.getAccountById = async (req, res) => {
  let data = await accountRepository.getAccountById(req.params.id);
  return res.status(data.status).json(data);
};

exports.createAccount = async (req, res) => {
  let data = await accountRepository.createAccount(req.body);
  return res.status(data.status).json(data);
};

exports.updateAccount = async (req, res) => {
  let data = await accountRepository.updateAccount(req.params.id, req.body);
  return res.status(data.status).json(data);
};
