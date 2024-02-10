import clientRepository from "../services/ClientServices"

exports.getClients = async (req, res) => {
  let data = await clientRepository.getClients(req.params.page);
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

exports.getClientById = async (req, res) => {
  let data = await clientRepository.getClientById(req.params.id);
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

exports.createClient = async (req, res) => {
  const data = await clientRepository.createClient(req.body);
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
}