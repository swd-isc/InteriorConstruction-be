import Color from '../models/Color';
import ReturnPolicy from '../models/ReturnPolicy';
import Design from '../models/Design';
import Delivery from '../models/Delivery';
import Furniture from '../models/Furniture';

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
// import { returnPolicyData } from '../sample-data/ReturnPolicyData';
// import { deliveryData } from '../sample-data/DeliveryData';
// import { furnitureData } from '../sample-data/FurnitureData';
// import { designData } from '../sample-data/DesignData';

export const colorServices = {
    getColorByPage: async (pageReq) => {
        try {
            const itemsPerPage = 10;
            // Parse query parameters
            const page = parseInt(pageReq) || 1;

            let currentPageData = [];

            // Calculate start and end indices for the current page
            const startIndex = (page - 1) * itemsPerPage;

            // Get the data for the current page
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            currentPageData = await Color.find({}).sort({ name: 1 }).skip(startIndex).limit(itemsPerPage);

            return {
                status: 200,
                data: currentPageData,
                page: page,
                message: currentPageData.length !== 0 ? "OK" : "No data"
            };

        } catch (error) {
            console.error(error);
            return {
                status: 500,
                messageError: error,
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
        // try {
        //     const url = process.env.URL_DB;
        //     await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' }).then(async () => {
        //         // Iterate over the array of fake accounts and save each to the database
        //         for (let i = 0; i < designData.length; i++) {
        //             try {
        //                 const account = new Design(designData[i]);
        //                 await account.save();
        //                 console.log('ok: ', i);
        //             } catch (error) {
        //                 console.error('client', i, 'error:', error.message);
        //             }
        //         }

        //         console.log('Fake accounts saved to the database!');
        //     })
        // } catch (error) {
        //     console.error(error.message);
        // } finally {
        //     // Close the database connection
        //     mongoose.connection.close();
        // }

        // try {
        //     const url = process.env.URL_DB;
        //     await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' }).then(async () => {
        //         // Iterate over the array of fake accounts and save each to the database
        //         for (let i = 0; i < furnitureData.length; i++) {
        //             try {
        //                 await Material.find({}).sort({ name: 1 }).skip(startIndex).limit(itemsPerPage).explain('executionStats');
        //                 let data = await Furniture.findOneAndUpdate({ name: furnitureData[i].name }, furnitureData[i]).exec();
        //                 console.log('ok: ', data);
        //             } catch (error) {
        //                 console.error('client', i, 'error:', error.message);
        //             }
        //         }

        //         console.log('Fake accounts saved to the database!');
        //     })
        // } catch (error) {
        //     console.error(error.message);
        // } finally {
        //     // Close the database connection
        //     mongoose.connection.close();
        // }
    },

    postColor: async (reqBody) => {
        try {
            let data = [];
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
            const color = new Color(reqBody);

            try {
                data = await color.save();
            } catch (error) {
                return {
                    status: 400,
                    data: {},
                    messageError: error.message
                }
            }

            //Code for insert data
            // const colorDocuments = [
            //     { name: 'Test Color', description: "test" },
            //     { name: 'Test Color', description: "test" },
            //     // Add more documents as needed
            // ];

            // let isError = false
            // for (let i = 0; i < colorDocuments.length; i++) {
            //     try {
            //         const color = new Color(colorDocuments[i]);
            //         await color.validate();
            //     } catch (error) {
            //         console.error('color', i, 'error:', error.message);
            //         isError = true;
            //     }
            // }
            // isError = await checkDupName(colorDocuments);

            // if (!isError) {
            //     for (let i = 0; i < colorDocuments.length; i++) {
            //         try {
            //             const color = new Color(colorDocuments[i]);
            //             await color.save();
            //         } catch (error) {
            //             console.error('color', i, 'error:', error.message);
            //         }
            //     }
            // }

            return {
                status: 201,
                data: data,
                message: data.length !== 0 ? "OK" : "No data"
            };
        } catch (error) {
            console.error('error ne', error);
            return {
                status: 500,
                messageError: error.toString(),
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    },

    putColor: async (colorId, reqBody) => {
        try {
            let data = {};
            //Validate classificationId
            const idColorValid = await isIdValid(colorId, 'color');

            if (!idColorValid.isValid) {
                return {
                    status: idColorValid.status,
                    data: {},
                    messageError: idColorValid.messageError
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
                data = await Color.findByIdAndUpdate(colorId, reqBody, { runValidators: true, new: true });
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
                messageError: error.toString(),
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    },

    colorById: async (id) => {
        if (id) {
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
            try {
                const data = await Color.findById(id);
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
                    status: 400,
                    messageError: error.toString(),
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
    },

    deleteColor: async (colorId) => {
        try {
            let data = {};
            //Validate classificationId
            const idColorValid = await isIdValid(colorId, 'color');

            if (!idColorValid.isValid) {
                return {
                    status: idColorValid.status,
                    data: {},
                    messageError: idColorValid.messageError
                }
            }

            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            try {

                const furnitureWithColor = await Furniture.findOne({ colors: colorId });
                if (furnitureWithColor) {
                    return {
                        status: 400,
                        data: {},
                        messageError: 'Cannot delete color because it is referenced by one or more furnitures.'
                    };
                }


                data = await Color.findOneAndDelete({ _id: new ObjectId(colorId) });
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
                messageError: error.toString(),
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    },
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
            case 'color':
                // Check if the color with the given ObjectId exists in the database
                data = await Color.findById(id);
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

async function checkDupName(arrays) {
    const uniqueNames = new Set();

    for (const item of arrays) {
        if (uniqueNames.has(item.name)) {
            console.log('Dup:', item.name);
            return true; // Duplicate name found
        }
        uniqueNames.add(item.name);
    }

    return false; // All item names are unique
}
