import connection from "../config/database.js"
export const storeSales = (args) => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction(function(error) {
            if (error) {
                reject(error);
            }
            connection.query("SELECT MAX(id) as max_id from SALES", function(error, result) {
                if (error) {
                    reject(error);
                }
                const maxId = result[0]?.max_id;
                const transaction_number = generateTransactionNumber(maxId + 1);
                const salesData = {
                    transaction_number: transaction_number,
                    user_id: 6,
                    customer_id: args?.customerId
                }
                connection.query("INSERT INTO sales SET ?", salesData , function(error, sales_result) {
                    if (error) {
                        return connection.rollback(function() {
                            reject(error);
                        })
                    }
                    console.log(`sales result`, sales_result);
                    const salesId = parseInt(sales_result?.insertId);
                    const lineItems = args?.lineItems.map((lineItem) => {
                        const newValue = {
                            ...lineItem,
                            sales_id: salesId,
                            transaction_number: transaction_number,
                            item_id: lineItem?.itemId,
                            discount: 1,
                            profit: '1',
                            user_id: 6,
                            staff: '',
                            capital: 6,
                            returned: 0,
                            barcode: ''
                        };
                        delete newValue?.itemId;
                        return newValue;
                    })
                    connection.query("INSERT INTO sales_description SET ?", lineItems, function(error, result) {
                        if (error) {
                            return connection.rollback(function() {
                                reject(error);
                            })
                        }
                        connection.commit(function(error) {
                            if (error) reject(error)
                            resolve({
                                success: true,
                                message: transaction_number
                            });
                        })
                        
                    });
                });
            });
            
        });
    })
}

const generateTransactionNumber = (lastId) => {
    const suffix = "TRX";
    const digits = 8;
    const remainingDigits = digits - lastId.toString().length;

    const transaction_number = suffix + ("0".repeat(remainingDigits) + lastId.toString());
    return transaction_number;
}