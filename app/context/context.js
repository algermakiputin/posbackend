import jsonwebtoken from "jsonwebtoken";
import 'dotenv/config';
import { LocalStorage } from "node-localstorage";
import { GraphQLError } from "graphql";
global.localStorage = new LocalStorage('./scratch');

export const getUser = (token) => {
    try {
        const user = jsonwebtoken.verify(token, process.env.SECRET_KEY);
        return user;
    } catch (error) {
        throw new GraphQLError(error);
    }
};

export const context =  async ({req, res}) => {
    if (req.body.operationName === "Login" || req.body.operationName === "Register") {
        return {};
    }
    // const token = req.headers.authorization;
    // const user = await getUser(token);
    // if (!user) throw new GraphQLError("User is not Authenticated");
    // return { user };
}