import { accountRepository } from "../services/AccountServices";

const insertSampleData = async (req, res) => {
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

export const accountService = {
  getAccounts: async (req, res) => {
    let data = await accountRepository.getAccounts(
      req.query.sort_by,
      req.query.page
    );
    return res.status(data.status).json(data);
  },

  getAccountById: async (req, res) => {
    let data = await accountRepository.getAccountById(req.params.id);
    return res.status(data.status).json(data);
  },

  // getAccountsByEmail: async (req, res) => {
  //   let data = await accountRepository.getAccountsByEmail();
  //   return res.status(data.status).json(data);
  // },

  createAccount: async (req, res) => {
    let data = await accountRepository.createAccount(req.body);
    return res.status(data.status).json(data);
  },

  updateAccountByAdmin: async (req, res) => {
    console.log(req.params.id)
    let data = await accountRepository.updateAccountByAdmin(req.params.id, req.body);
    return res.status(data.status).json(data);
  },

  deleteAccount: async (req, res) => {
    let data = await accountRepository.deleteAccount(req.params.id);
    return res.status(data.status).json(data);
  },
};
