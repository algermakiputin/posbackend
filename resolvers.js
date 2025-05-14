import { getItems, findItem, storeItem, updateItem, destroyItem, getInventorySummary, addStocks } from "./app/helpers/items_resolver_helpers.js";
import { destroySupplier, getSuppliers, storeSupplier, findSupplier, updateSupplier } from "./app/helpers/supplier_resolver_helpers.js";
import { getCategories, storeCategory, destroyCategory, updateCategory, findCategory } from './app/helpers/categories_resolver_helpers.js';
import { getSales, getSalesDetails, getSalesOverView, storeSales } from "./app/helpers/sales_resolver_helpers.js";
import { register, login, getUsers, findUser, updateUser, destroyUser } from './app/helpers/users_resolver_helpers.js';
import { GraphQLError } from "graphql";

export const resolvers = {
    Query: {
        test: async () => {
            return {
                message: "Hello world"
            };
        },
        items: async (root, args) => {
            return await getItems(args);
        },
        item: async (root, args) => {
            const item = await findItem(args?.id);
            return item[0];
        },
        categories: async (_, args) => {  
            return await getCategories(args.storeId);
        },
        category: async (root, args) => {
            return await findCategory(args.id);
        },
        suppliers: async (_, args) => {
            return await getSuppliers(args?.storeId);
        },
        supplier: async (root, args) => {
            console.log(`args`, args);
            return await findSupplier(args.id);
        },  
        getSales: async (_, args) => {
            console.log(`getting sales`, args);
            return await getSales(args.filter);
        },
        inventorySummary: async (root, args) => {
            return await getInventorySummary(args);
        },
        getSalesOverview: async (root, args) => {
            console.log(`get sales overview`, args);
            return await getSalesOverView(args);
        },
        getSalesDetails: async (root, args) => {
            console.log(`args`, args);
            return await getSalesDetails(args.transaction_number);
        },
        getUsers: async(root, args) => {
            return await getUsers(args.adminId);
        },
        user: async(root, args) => {
            return await findUser(args.userId);
        }
    },
    Mutation: {
        storeCategory: async (root, args) => {
            return await storeCategory(args.category);
        },
        destroyCategory: async (root, args) => {
            return await destroyCategory(args.id);
        },
        updateCategory: async (root, args) => {
            return await updateCategory(args.category);
        },
        storeItem: async (root, args) => {
            return await storeItem(args.item);
        },
        storeSales: async (root, args) => {
            return await storeSales(args?.sales);
        },
        updateItem: async (root, args) => {
            return await updateItem(args?.editItemInput);
        },
        destroyItem: async(root, args) => {
            console.log(`args`, args);
            return await destroyItem(args?.id);
        },
        destroySupplier: async(root, args) => {
            return await destroySupplier(args?.id);
        },
        storeSupplier: async(root, args) => {
            return await storeSupplier(args?.supplier);
        },
        updateSupplier: async(root, args) => {
            const id = args.supplier.id;
            delete args.supplier.id;
            return await updateSupplier(args.supplier, id)
        },
        register: async(root, args) => {
            return await register(args.user);
        },
        login: async(root, args, context) => {
            try {
                const userLogin = await login(args.user);
                if (!userLogin?.success) {
                    return new GraphQLError("Invalid username or password", {
                        extensions: {
                            code: '1001'
                        }
                    });
                }
                return userLogin?.data;
            } catch (error) {
                return { error: true };
            }
           
        },
        updateUser: async(root, args) => {
            return await updateUser(args.user);
        },
        destroyUser: async(root, args) => {
            console.log(`delete user args`, args);
            return await destroyUser(args.id);
        },
        addStocks: async(root, args) => {
            console.log(`args`, args);
            const { stocks, id } = args.item ?? {};
            return await addStocks(stocks, id);
        }
    }
}