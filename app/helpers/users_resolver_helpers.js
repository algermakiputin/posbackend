import connection from "../config/database.js";
import jsonwebtoken from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { GraphQLError } from "graphql";
import { LocalStorage } from "node-localstorage";
global.localStorage = new LocalStorage('./scratch');

export const register = async (user) => {
    if (user.password == user.confirmPassword) {
        const hashPassword = await bcrypt.hash(user.password, 12);
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
            connection.query("SELECT * FROM users WHERE email = ?", user.email, function(error, userResult) {
                if (error) reject(error);
                if (userResult?.length) {
                    reject(new GraphQLError("Email already exist", {arguments : {code: 400}}));
                }
            });
            connection.query("INSERT INTO users SET ?", data, function(error, result) {
                if (error) reject(error);
                const jwtToken = generateToken(result?.insertId, user);
                resolve({
                    token: jwtToken,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    id: result?.insertId
                });
            }); 
        });
    } else {
        throw new Error("Password and confirm password does not match");
    }
};

export const login = async (user) => {
    console.log(`logging in`);
    if (user.email && user.password) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM users WHERE email = ? LIMIT 1", user.email, async function(error, result) {
                if (error) reject(error); 
                if (result?.length) {
                    const match = await bcrypt.compare(user.password, result?.[0]?.password);
                    if (match) {
                        const token = generateToken(result?.[0]?.id, result?.[0]);
                        localStorage.setItem('token', token);
                        resolve({
                            token,
                            firstName: result?.[0]?.firstName,
                            lastName: result?.[0]?.lastName,
                            email: result?.[0]?.email,
                            id: result?.[0]?.id
                        })
                    } else {
                        console.log(`password not match`);
                        reject(error);
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

const generateToken = (id, user) => {
    return jsonwebtoken.sign({
        id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName
    }, process.env.SECRET_KEY, { expiresIn: '1h'} );
};