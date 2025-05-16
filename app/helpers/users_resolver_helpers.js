import connection from "../config/database.js";
import jsonwebtoken from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { GraphQLError } from "graphql";
import { LocalStorage } from "node-localstorage";
import logger from '../logger/logger.js';

global.localStorage = new LocalStorage('./scratch');

export const register = async (user) => {
    if (user.password == user.confirmPassword) {
        const hashPassword = await bcrypt.hash(user.password, 12);
        const isAdmin = !user?.staff;
        const data = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            account_type: user?.staff ? 'Staff' : 'Admin',
            password: hashPassword,
            date_created: new Date().toISOString(),
            created_by: 'Admin',
            admin_id: user?.admin_id
        };
        return new Promise((resolve, reject) => {
            connection.beginTransaction(function(transactionError) {
                if (transactionError) reject(transactionError);
                connection.query("SELECT * FROM users WHERE email = ?", user.email, function(error, userResult) {
                    if (error) reject(error);
                    if (userResult?.length) {
                        reject(new GraphQLError("Email already exist", {arguments : {code: 400}}));
                    }
                });
                connection.query("INSERT INTO users SET ?", data, function(error, result) {
                    if (error) reject(error);
                    const jwtToken = generateToken(result?.insertId, user);
                    const store = {
                        user_id: result?.insertId,
                        name: data.firstName
                    }
                    if (isAdmin) {
                        connection.query("INSERT INTO stores SET ?", store, function(error, result) {
                            if (error) {
                                connection.rollback(function(err) {
                                    reject(error);
                                });
                            };
                            connection.commit();
                            resolve({
                                token: jwtToken,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                id: result?.insertId
                            });
                        });
                    } else {
                        resolve({
                            token: jwtToken,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            id: result?.insertId
                        });
                    }
                });
            });
        });
    } else {
        throw new Error("Password and confirm password does not match");
    }
};

export const login = async (user) => {
    logger.info(`user param ${JSON.stringify(user)}`);
    if (user.email && user.password) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM users WHERE email = ? LIMIT 1", user.email, async function(error, result) {
                if (error) reject(error);
                logger.info(`user query result: ${JSON.stringify(result)}`);
                console.log(`result`, result);
                if (result?.length) {
                    const match = await bcrypt.compare(user.password, result?.[0]?.password);
                    if (match) { 
                        const userResult = result?.[0];
                        const userId = userResult?.account_type === "Admin" ? userResult?.id : userResult?.admin_id;
                        connection.query("SELECT id FROM stores WHERE user_id = ?", userId, function(error, storeResult){
                            if (error) {
                                logger.error(`error fetching user: ${JSON.stringify(error)}`);
                                reject(error)
                            };
                            const token = generateToken(userResult?.id, userResult);
                            localStorage.setItem('token', token);
                            const response = {
                                token,
                                firstName: userResult?.firstName,
                                lastName: userResult?.lastName,
                                email: userResult?.email,
                                id: userResult?.id,
                                storeId: storeResult?.[0]?.id,
                                accountType: userResult?.account_type
                            };
                            logger.info(`response ${JSON.stringify(response)}`);
                            resolve({
                                success: true,
                                data: response
                            });
                        });
                    } else {
                        logger.info(`Username and password does not match`);
                        resolve({
                            success: false,
                            message: 'Username and password does not match'
                        });
                    }
                }
            });
        });
    }
}

export const getUsers = async (adminId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM users WHERE admin_id = ?", adminId, function(error, result) {
            if (error) reject(error);
            resolve(result);
        });
    });
}

export const findUser = async (userId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM users WHERE id = ?", userId, function(error, result) {
            if (error) reject(error);
            resolve(result?.length ? result[0] : []);
        });
    });
}

export const updateUser = async (user) => {
    if (user?.password && user?.confirmPassword) {
        const hashPassword = await bcrypt.hash(user.password, 12);
        user.password = hashPassword;
        delete user.confirmPassword;
    }
    return new Promise((resolve, reject) => {
        const id = user.id;
        delete user.id;
        connection.query("UPDATE users SET ? WHERE id = ?", [user, id], function(error, result) {
            if (error) reject(error);
            resolve({
                success: true,
                data: JSON.stringify(result)
            });
        });
    });
}

export const destroyUser = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM users WHERE id = ?", id, function(error, result) {
            if (error) reject(error);
            resolve({
                success: true, 
                data: JSON.stringify(result)
            })
        })
    }); 
};  

const generateToken = (id, user) => {
    return jsonwebtoken.sign({
        id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName
    }, process.env.SECRET_KEY, { expiresIn: '1h'} );
};
