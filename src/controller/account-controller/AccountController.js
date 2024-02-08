const accountRepository = require("../../services/account-services/accountServices");

exports.getAccounts = async (req, res) => {
  let data = await accountRepository.getAccounts(req.params.page);
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

exports.getAccountById = async (req, res) => {
  let data = await accountRepository.getAccountById(req.params.id);
  if (!data.error) {
    return res.status(200).json({
      status: 200,
      data: account,
      message: "OK",
    });
  } else {
    return res.status(500).json({
      status: 500,
      messageError: data.error,
    });
  }
};
