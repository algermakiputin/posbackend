import { getItems, findItem, storeItem, getItem, updateItem, destroyItem, getInventorySummary } from "./app/helpers/items_resolver_helpers.js";
import { destroySupplier, getSuppliers, storeSupplier } from "./app/helpers/supplier_resolver_helpers.js";
import { getCategories, storeCategory, destroyCategory, updateCategory } from './app/helpers/categories_resolver_helpers.js';
import { getSales, getSalesDetails, getSalesOverView, storeSales } from "./app/helpers/sales_resolver_helpers.js";
import { register, login } from './app/helpers/users_resolver_helpers.js';
export const resolvers = {
    Query: {
        items: async (root, args) => {
            return await getItems(args);
        },
        item: async (root, args) => {
            const item = await findItem(args?.id);
            return item[0];
        },
        categories: async () => {  
            return await getCategories();
        },
        suppliers: async () => {
            return await getSuppliers();
        },
        getSales: async () => {
            return await getSales("Last 30 Days");
        },
        item: async (root, args) => {
            return await getItem(args.id);
        },
        inventorySummary: async (root, args) => {
            return await getInventorySummary(args);
        },
        getSalesOverview: async (root, args) => {
            return await getSalesOverView(args);
        },
        getSalesDetails: async (root, args) => {
            console.log(`args`, args);
            return await getSalesDetails(args.transaction_number);
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
            console.log(`args`, args);
            return await storeSales(args?.sales?.cart);
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
        register: async(root, args) => {
            return await register(args.user);
        },
        login: async(root, args, context) => {
            return await login(args.user)
        }
    }
}