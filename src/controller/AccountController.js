import accountRepository from "../services/AccountServices"

exports.getAccounts = async (req, res) => {
  let data = await accountRepository.getAccounts(req.params.page);
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

exports.getAccountById = async (req, res) => {
  let data = await accountRepository.getAccountById(req.params.id);
  if (!data.error) {
    return res.status(200).json({
      status: 200,
      data: account,
      message: "OK",
    });
  } else {
    return res.status(data.status).json({
      status: data.status,
      messageError: data.error,
    });
  }
};

exports.createAccount = async (req, res) => {
  const data = await accountRepository.createAccount(req.body);
  if (!data.error) {
    return res.status(200).json({
      status: 200,
      data: data.data,
      message: "OK",
    });
  } else {
    return res.status(data.status).json({
      status: data.status,
      error: data.error,
    });
  }
};
