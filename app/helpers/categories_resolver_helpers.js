import connection from "../config/database.js";

export const getCategories = async () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM categories ORDER BY id DESC", function(error, result, fields) {
            if (error) reject(error);
            resolve(result);
        });
    });
}

export const storeCategory = async (params) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO categories SET ?", {name: params.name, active: 1}, function(error, result) {
            if (error) reject(error);
            resolve({
                success: true,
                data: JSON.stringify(result)
            });
        });
    });
};

export const destroyCategory = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM categories WHERE id = ?", id, function(error, result) {
            if (error) reject(error);
            resolve({
                success: true,
                data: JSON.stringify(result)
            })
        })
    });
}

export const updateCategory = async (category) => {
    console.log(`category`, category);
    return new Promise((resolve, reject) => {
        connection.query({
            sql: "UPDATE categories SET ? WHERE id = ?",
            values: [{name: category.name}, category.id],
            timeout: 40
        }, function(error, result) {
            if (error) reject(error);
            resolve({
                success: true,
                message: JSON.stringify(result)
            });
        })
    });
}