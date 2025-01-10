import jsonwebtoken from "jsonwebtoken";
import 'dotenv/config';
import { LocalStorage } from "node-localstorage";
global.localStorage = new LocalStorage('./scratch');

export const getUser = (token) => {
    try {
        if (token) {
            const user = jsonwebtoken.verify(token, process.env.SECRET_KEY);
            console.log(`user`, user);
            return user;
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const context =  async ({req, res}) => {
    const token = req.header.authorization || localStorage.getItem('token');
    const user = await getUser(token);
    return { user };
}