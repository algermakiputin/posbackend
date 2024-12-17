import connection from "../config/database.js";

export const getItems = async (params) => {
    const { query, limit } = params.filter;
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            SELECT items.*, supplier.name as supplierName, categories.name as categoryName, categories.id as stocks
                FROM items
                LEFT JOIN supplier 
                    ON items.supplier_id = supplier.id
                LEFT JOIN categories 
                    ON categories.id = items.category_id
                WHERE items.name LIKE ? LIMIT ? OFFSET 0
        `;
        connection.query({
            sql: sqlQuery,
            values: [`%${query}%`, limit ? limit : 10],
            timeout: 40
        }, function(error, result, fields) {
            if (error) reject(error);
            console.log(`result`, result);
            resolve(result);
        });
    });
}

export const findItem = async (itemId) => {
    return new Promise((resolve, reject) => {
        connection.query({
            sql: 'SELECT * FROM items WHERE id = ?',
            timeout: 40,
            values: [itemId]
        }, function(error, result) {
            if (error) reject(error);
            resolve(result);
        });
    });
}