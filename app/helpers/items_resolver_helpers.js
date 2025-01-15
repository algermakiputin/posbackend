import connection from "../config/database.js";

export const getItems = async (params) => {
    console.log(`params`, params);
    return new Promise((resolve, reject) => {
        var sqlQuery = `
            SELECT items.*, supplier.name as supplierName, categories.name as categoryName, categories.id as stocks
                FROM items
                LEFT JOIN supplier 
                    ON items.supplier_id = supplier.id
                LEFT JOIN categories 
                    ON categories.id = items.category_id
                WHERE items.name LIKE ? 
        `;
        if (params?.filter?.categories?.length) {
            sqlQuery = sqlQuery.concat(" AND category_id IN (?)")
        } 

        if (params?.filter?.suppliers?.length) {
            sqlQuery = sqlQuery.concat(" AND supplier_id IN (?)")
        }

        sqlQuery = sqlQuery.concat(` ORDER BY items.id DESC LIMIT ${params?.filter?.limit} OFFSET 0`);
        connection.query("SELECT COUNT(id) as total_rows FROM items", function(countError, countResult) {
            if (countError) reject(countError);
            connection.query({
                sql: sqlQuery,
                values: [
                    `%${params?.filter?.query || ''}%`, 
                    params?.filter?.categories,
                    params?.filter?.suppliers,
                ],
                timeout: 60
            }, function(error, result, fields) {
                if (error) reject(error);
                resolve({
                    data: result,
                    count: countResult[0]?.total_rows
                });
            });
        });
        
        
    });
}

export const findItem = async (itemId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT items.*, supplier.name as supplierName, categories.name as categoryName 
                FROM items
                LEFT JOIN supplier 
                    ON items.supplier_id = supplier.id
                LEFT JOIN categories 
                    ON categories.id = items.category_id
                WHERE items.id = ?
        `;
        connection.query({
            sql: query,
            timeout: 40,
            values: [itemId]
        }, function(error, result) {
            if (error) reject(error);
            console.log(`resultqweqwe`, result);
            resolve(result);
        });
    });
}

export const updateItem = async (item) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE items SET ? WHERE id = ?", [item, item?.id], function(error, result) {
            if (error) reject(error);
            resolve({
                success:true, 
                message: JSON.stringify(result)
            });
        });
    });
}

export const destroyItem = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM items WHERE id = ?", id, function(error, result) {
            if (error) reject(error);
            resolve({
                success: true,
                message: JSON.stringify(result)
            }); 
        });
    });
}

export const storeItem = async (item) => {
    item.price = parseFloat(item.price);
    item.capital = parseFloat(item.capital);
    item.category_id = Number(item.category_id);
    item.supplier_id = Number(item.supplier_id);
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO items SET ?", item, function(error, result) {
            console.log(`error`, error);
            if (error) reject(error);
            resolve({
                success: true,
                message: 'Item added successfully',
                data: JSON.stringify(result)
            });
        });
    });
};

export const getInventorySummary = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT COUNT(id) as totalItems, COUNT(DISTINCT category_id) as category_count, SUM(price * stocks) as totalValue, SUM(stocks * capital) as capital
                FROM items
        `
        connection.query(query, function(error, result) {
            if (error) reject(error);
            resolve({
                totalItems: result?.[0]?.totalItems,
                categories: result?.[0]?.category_count,
                value: result?.[0]?.totalValue,
                capital: result?.[0]?.capital,
            });
        });
    });
}