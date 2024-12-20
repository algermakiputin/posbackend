import connection from "../config/database.js";

export const getItems = async (params) => {
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
            values: [`%${params?.filter?.query || ''}%`, params?.filter?.limit ? params?.filter?.limit : 10],
            timeout: 60
        }, function(error, result, fields) {
            if (error) reject(error);
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

export const updateItem = async (item) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE items SET ? WHERE id = ?", [], function(error, result) {
            if (error) reject(error);
            resolve(result);
        });
    });
}

export const destroyItem = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE items WHERE id = ?", id, function(error, result) {
            if (error) reject(error);
            resolve(true);
        });
    });
}

export const storeItem = async (item) => {
    item.price = parseFloat(item.price);
    item.capital = parseFloat(item.capital);
    item.category_id = Number(item.category_id);
    item.supplier_id = Number(item.supplier_id);
    item.image = '';

    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO items SET ?", item, function(error, result) {
            if (error) reject(error);
            resolve({
                success: true,
                message: 'Item added successfully',
                data: JSON.stringify(result)
            });
        });
    });
};