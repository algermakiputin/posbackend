import connection from "../config/database.js";

export const getSuppliers = async (storeId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM supplier WHERE store_id = ? ORDER BY id DESC", storeId, function(error, result) {
            if (error) reject(error);
            resolve(result);
        })
    });
}

export const destroySupplier = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM supplier WHERE id = ?", id, function(error, result) {
            if (error) reject(error);
            resolve({
                success: true,
                data: JSON.stringify(result)
            })
        });
    });
}

export const storeSupplier = async (supplier) => {
    console.log(`supplier`,supplier);
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO supplier SET ?", supplier, function(error, result) {
            if (error) reject(error);
            resolve({
                success: true,
                data: JSON.stringify(result)
            });
        });
    });
};

export const findSupplier = (id) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM supplier WHERE id = ?", id, function(error, result) {
            if (error) reject(error);
            resolve(result[0]);
        });
    });
}

export const updateSupplier = (supplier, id) => {
    console.log(`supplier`, supplier);
    console.log('id', id);
    return new Promise((resolve, reject) => {
        connection.query("UPDATE supplier SET ? WHERE id = ?", [supplier, id], function(error, result) {
            if (error) reject(error);
            console.log(`result`, result);
            resolve({
                success: true,
                data: JSON.stringify(result)
            });
        });
    });
}