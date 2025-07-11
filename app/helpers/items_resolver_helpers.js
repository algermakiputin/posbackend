import connection from "../config/database.js";

export const getItems = async (params) => {
    return new Promise((resolve, reject) => {
        let values = [
            `%${params?.filter?.query || ''}%`, 
            params?.filter?.storeId
        ];
        var sqlQuery = `
            SELECT items.*, supplier.name as supplierName, categories.name as categoryName, categories.id as categoryId
                FROM items
                LEFT JOIN supplier 
                    ON items.supplier_id = supplier.id
                LEFT JOIN categories 
                    ON categories.id = items.category_id
                WHERE items.name LIKE ? 
                AND items.store_id = ?
        `;
        if (params?.filter?.categories?.length) {
            sqlQuery = sqlQuery.concat(" AND category_id IN (?)");
            values.push(params?.filter?.categories);
        } 

        if (params?.filter?.suppliers?.length) {
            sqlQuery = sqlQuery.concat(" AND supplier_id IN (?)");
            values.push(params?.filter?.suppliers)
        }
        sqlQuery = sqlQuery.concat(` ORDER BY items.id DESC LIMIT ? OFFSET 0`);
        values.push(params?.filter?.limit);
        connection.query("SELECT COUNT(id) as total_rows FROM items WHERE store_id = ?", params?.filter?.storeId ,function(countError, countResult) {
            if (countError) reject(countError);
            connection.query({
                sql: sqlQuery,
                values: values,
                timeout: 60
            }, function(error, result, fields) {
                if (error) reject(error);
                console.log(`result`, result);
                resolve({
                    data: result,
                    count: countResult?.[0]?.total_rows
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
    item.store_id = item.storeId;
    delete item.storeId;
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

export const getInventorySummary = (args) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT COUNT(id) as totalItems, COUNT(DISTINCT category_id) as category_count, SUM(price * stocks) as totalValue, SUM(stocks * capital) as capital
                FROM items
                WHERE store_id = ?
        `
        connection.query(query,args.storeId, function(error, result) {
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

export const addStocks = (stocks, id) => {
    console.log(`stocks`, stocks);
    console.log(`id`, id);
    return new Promise((resolve, reject) => {
        const query = "UPDATE items SET stocks = stocks + ? WHERE id = ?";
        connection.query(query, [stocks, id], function(error, result) {
            if (error) reject(error);
            console.log(`sql`, result.sql);
            resolve({
                success: true,
                message: JSON.stringify(result)
            });
        })
    });
}