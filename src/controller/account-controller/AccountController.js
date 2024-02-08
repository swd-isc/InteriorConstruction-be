const accountRepository = require("../../services/account-services/accountCRUD");

exports.getAccounts = async (req, res) => {
  let accounts = await accountRepository.getAccounts();
  return res.status(200).json({
    status: 200,
    data: accounts,
    message: "OK",
  });
};

exports.getAccountById = async (req, res) => {
  let account = await accountRepository.getAccountById(req.params.id);
  return res.status(200).json({
    status: 200,
    data: account,
    message: "OK",
  });
};
