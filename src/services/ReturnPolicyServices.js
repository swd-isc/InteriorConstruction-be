import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

import ReturnPolicy from '../models/ReturnPolicy';

export const returnPolicyById = async (id) => {
    if (id) {
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        try {
            const data = await ReturnPolicy.findById(id);
            if (data) {
                return {
                    status: 200,
                    data: data,
                    message: "OK"
                };
            } else {
                return {
                    status: 200,
                    data: {},
                    message: "No data"
                }
            }
        } catch (error) {
            return {
                status: 500,
                messageError: error,
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    } else {
        return {
            status: 400,
            messageError: 'Missing required ID',
        }
    }
}

export const postReturnPolicy = async (reqBody) => {
    try {
        let data = [];
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        const returnPolicy = new ReturnPolicy(reqBody);

        try {
            data = await returnPolicy.save();
        } catch (error) {
            return {
                status: 400,
                data: {},
                messageError: error.message
            }
        }

        //Code for insert data
        // const returnPolicyDocuments = [
        //     {
        //         headerName: 'Return and exchange policy',
        //         headerDescription: "InteriorConstruction provides high-quality products and services. You will no longer be worried because InteriorConstruction is always willing to solve product issues during use.",
        //         titleName: "RETURN AND EXCHANGE POLICY",
        //         titleDescription: "With the desire to ensure customers' benefits and improve service quality, customers can return or exchange goods for the most comfort and satisfaction at InteriorConstruction.",
        //         returnExchangeCases: [
        //             "The product cannot be brought into the house (narrow stairs, narrow doors, …)",
        //             "Insufficient quantity, insufficient set as specified in the order",
        //             "The product is defective or not substandard.",
        //         ],
        //         nonReturnExchangeCases: [
        //             "The products that are used, unclean, old, or damaged.",
        //             "Insufficient invoices and vouchers.",
        //             "Promotional products.",
        //         ],
        //         returnProcedure: [
        //             "Time allowed to exchange or return goods: Within 3 days from the date of delivery, before the invoice is issued.",
        //             "When you have a request to exchange or return goods, please contact the InteriorConstruction showroom where the transaction was made or via hotline: 0388415317.",
        //             "InteriorConstruction bears the cost of exchange and return services.",
        //         ]
        //     },
        //     {
        //         headerName: 'Return and exchange policy',
        //         headerDescription: "InteriorConstruction provides high-quality products and services. You will no longer be worried because InteriorConstruction is always willing to solve product issues during use.",
        //         titleName: "RETURN AND EXCHANGE POLICY",
        //         titleDescription: "With the desire to ensure customers' benefits and improve service quality, customers can return or exchange goods for the most comfort and satisfaction at InteriorConstruction.",
        //         returnExchangeCases: [
        //             "The product cannot be brought into the house (narrow stairs, narrow doors, …)",
        //             "Insufficient quantity, insufficient set as specified in the order",
        //             "The product is defective or not substandard.",
        //         ],
        //         nonReturnExchangeCases: [
        //             "The products that are used, unclean, old, or damaged.",
        //             "Insufficient invoices and vouchers.",
        //             "Promotional products.",
        //         ],
        //         returnProcedure: [
        //             "Time allowed to exchange or return goods: Within 3 days from the date of delivery, before the invoice is issued.",
        //             "When you have a request to exchange or return goods, please contact the InteriorConstruction showroom where the transaction was made or via hotline: 0388415317.",
        //             "InteriorConstruction bears the cost of exchange and return services.",
        //         ]
        //     }
        // ];

        // let isError = false
        // for (let i = 0; i < returnPolicyDocuments.length; i++) {
        //     try {
        //         const returnPolicy = new ReturnPolicy(returnPolicyDocuments[i]);
        //         await returnPolicy.validate();
        //     } catch (error) {
        //         console.error('returnPolicy', i, 'error:', error.message);
        //         isError = true;
        //     }
        // }

        // if (!isError) {
        //     for (let i = 0; i < returnPolicyDocuments.length; i++) {
        //         try {
        //             const returnPolicy = new ReturnPolicy(returnPolicyDocuments[i]);
        //             await returnPolicy.save();
        //         } catch (error) {
        //             console.error('returnPolicy', i, 'error:', error.message);
        //         }
        //     }
        // }

        return {
            status: 200,
            data: data,
            message: data.length !== 0 ? "OK" : "No data"
        };
    } catch (error) {
        console.error('error ne', error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const putReturnPolicy = async (returnPolicyId, reqBody) => {
    try {
        let data = {};
        //Validate classificationId
        const idReturnPolicyValid = await isIdValid(returnPolicyId, 'return_policy');

        if (!idReturnPolicyValid.isValid) {
            return {
                status: idReturnPolicyValid.status,
                data: {},
                messageError: idReturnPolicyValid.messageError
            }
        }

        if (!reqBody) {
            return {
                status: 400,
                data: {},
                messageError: "Required body"
            }
        }

        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        try {
            data = await ReturnPolicy.findByIdAndUpdate(returnPolicyId, reqBody, { runValidators: true, new: true });
        } catch (error) {
            return {
                status: 400,
                data: {},
                messageError: error.message
            }

        }

        return {
            status: 200,
            data: data !== null ? data : {},
            message: data !== null ? "OK" : "No data"
        };
    } catch (error) {
        console.error('error ne', error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const deleteReturnPolicy = async (returnPolicyId) => {
    try {
        let data = {};
        //Validate classificationId
        const idReturnPolicyValid = await isIdValid(returnPolicyId, 'return_policy');

        if (!idReturnPolicyValid.isValid) {
            return {
                status: idReturnPolicyValid.status,
                data: {},
                messageError: idReturnPolicyValid.messageError
            }
        }

        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        try {
            data = await ReturnPolicy.findOneAndDelete({ _id: new ObjectId(returnPolicyId) });
        } catch (error) {
            return {
                status: 400,
                data: {},
                messageError: error.message
            }

        }

        return {
            status: 200,
            data: data !== null ? data : {},
            message: data !== null ? "OK" : "No data"
        };
    } catch (error) {
        console.error('error ne', error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

async function isIdValid(id, model) {
    if (id === null || id === undefined) {
        return {
            status: 400,
            isValid: false,
            messageError: `ObjectId ${model} required.`
        }
    }
    try {
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

        if (!isValidObjectId) {
            // The provided id is not a valid ObjectId
            return {
                status: 400,
                isValid: false,
                messageError: `Not a valid ${model} ObjectId.`
            }
        }

        let data = null;

        switch (model) {
            case 'return_policy':
                // Check if the classification with the given ObjectId exists in the database
                data = await ReturnPolicy.findById(id);
                break;
            default:
                break;
        }

        if (data !== null) {
            return {
                isValid: true,// Returns true if data exists, false otherwise
            }
        } else {
            return {
                status: 400,
                isValid: false,
                messageError: 'ObjectId not found.'
            }
        }

    } catch (error) {
        console.error('Error checking ObjectId:', error);
        return {
            status: 500,
            isValid: false,
            messageError: error
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}
