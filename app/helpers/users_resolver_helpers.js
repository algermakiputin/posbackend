import connection from "../config/database.js";
import jsonwebtoken from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import 'dotenv/config'

export const register = async (user) => {
    if (user.password == user.confirmPassword) {
        const hashPassword = await bcrypt.hash(user.password, 12);
        const data = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            account_type: 'Admin',
            password: hashPassword,
            date_created: new Date().toISOString(),
            created_by: 'Admin'
        };
        
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO users SET ?", data, function(error, result) {
                if (error) reject(error);
                const jwtToken = generateToken(result?.insertId, user.email);
                console.log(`jwt token`, jwtToken);
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
    if (user.email && user.password) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM users WHERE email = ? LIMIT 1", user.email, async function(error, result) {
                if (error) reject(error); 
                if (result?.length) {
                    const match = await bcrypt.compare(user.password, result?.[0]?.password);
                    if (match) {
                        const token = generateToken(result?.[0]?.id, user?.email);
                        resolve({
                            token,
                            firstName: result?.[0]?.firstName,
                            lastName: result?.[0]?.lastName,
                            email: result?.[0]?.email,
                            id: result?.[0]?.id
                        })
                    } else {
                        reject("Incorrect username or password");
                    }
                }
            });
        });
    }
}

const generateToken = (id, email) => {
    return jsonwebtoken.sign({
        id,
        email
    }, process.env.SECRET_KEY, { expiresIn: '1h'} );
};