import connection from "../config/database.js";
import * as dateFns from 'date-fns';

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
                    customer_id: args?.customerId,
                    date_time: formatDate(new Date, "yyyy-MM-dd hh:mm"),
                    store_id: args?.storeId
                }
                connection.query("INSERT INTO sales SET ?", salesData , function(error, sales_result) {
                    if (error) {
                        return connection.rollback(function() {
                            reject(error);
                        })
                    } 
                    const salesId = parseInt(sales_result?.insertId);
                    const lineItems = args?.cart?.lineItems.map((lineItem) => {
                        return [
                            salesId,
                            1,
                            lineItem?.name,
                            lineItem?.price,
                            lineItem?.quantity,
                            lineItem?.barcode,
                            lineItem?.capital,
                            0,
                            1,
                            6,
                            '',
                            0,
                            formatDate(new Date, "yyyy-MM-dd hh:mm"),
                            transaction_number,
                            args?.storeId
                        ];
                    });
                    console.log(`values`, lineItems);
                    connection.query("INSERT INTO sales_description (sales_id, item_id, name, price, quantity, barcode, capital, discount, profit, user_id, staff, returned, created_at, transaction_number, store_id) VALUES ?", [lineItems], function(error, result) {
                        if (error) {
                            return connection.rollback(function() {
                                reject(`error`, error);
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

export const getSales = (filter) => {
    const today = formatDate(new Date, "yyyy-MM-dd");
    var from;
    if (filter?.dateRange === "Today") {
        from = formatDate(new Date, "yyyy-MM-dd");
    } else if (filter?.dateRange === "Last 7 Days") {
        from = formatDate(dateFns.subDays(new Date, 7), "yyyy-MM-dd");
    } else if (filter?.dateRange === "Last 30 Days") {
        from = formatDate(dateFns.subDays(new Date, 30), "yyyy-MM-dd");
    }

    const salesQuery = `
        SELECT SUM(price * quantity) as totalEarnings, SUM(quantity) as itemSold, SUM((price - capital) * quantity) as netSales
            FROM sales_description
            WHERE DATE_FORMAT(created_at, '%Y-%m-%d') BETWEEN ? AND ?
            AND store_id = ?
    `;

    return new Promise((resolve, reject) => {
        connection.query(salesQuery, [from, today, filter.storeId], function(error, salesQueryResult) {
            if (error) reject(error);
            const sales_description_query = `
                SELECT sales.transaction_number, sales.customer_name, SUM(sales_description.quantity) as totalItems, SUM(sales_description.price * sales_description.quantity) as total, sales.date_time
                    FROM sales 
                    INNER JOIN sales_description ON sales_description.sales_id = sales.id
                    WHERE DATE_FORMAT(sales_description.created_at, '%Y-%m-%d') BETWEEN '${from}' AND '${today}' 
                    GROUP BY sales.id
                    ORDER BY sales.id DESC
                    LIMIT 10
            `;
            connection.query(sales_description_query, function(error, result) {
                if (error) reject(error);
                console.log(`the result`, result);
                resolve({
                    ...salesQueryResult?.[0],
                    transactions: result
                })
            });
        })
    })
}

export const getSalesOverView = () => {
    const today = new Date();
    const from = dateFns.subMonths(today, 11);
    const format = "yyyy-MM-dd";
    const keyFormat = "MMM";
    const data = [];
    for (var i = 11; i > 0; i--) {
        const dateKey =  dateFns.subMonths(today, i);
        data[formatDate(dateKey, keyFormat)] = 0;
    }
    data[formatDate(today, keyFormat)] = 0;
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM sales_description 
	            WHERE DATE_FORMAT(created_at, '%Y-%m-%d') BETWEEN "${formatDate(from, format)}" AND "${formatDate(today, format)}"
        `;
        connection.query(query, function(error, result) {
            if (error) reject(error);
            if (result?.length) {
                result?.forEach((sale) => {
                    const key = formatDate(sale?.created_at, keyFormat);
                    if (Object.hasOwn(data, key)) {
                        data[key] = data[key] + sale?.price * sale?.quantity;
                    } else {
                        data[key] = sale?.price * sale?.quantity;
                    }
                });
            }
            const response = {
                data: Object.values(data)?.map((value) => value),
                keys: Object.keys(data)?.map((value) => value ),
            };
            resolve(response);
        });
    });
}

export const getSalesDetails = (transaction_number) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM sales_description WHERE transaction_number = ?", transaction_number, function(error, result) {
            if (error) reject(error);
            resolve(result);
        })
    });
}

const formatDate = (date, format) => {
    return dateFns.format(date, format);
}

const generateTransactionNumber = (lastId) => {
    const suffix = "TRX";
    const digits = 8;
    const remainingDigits = digits - lastId.toString().length;

    const transaction_number = suffix + ("0".repeat(remainingDigits) + lastId.toString());
    return transaction_number;
}