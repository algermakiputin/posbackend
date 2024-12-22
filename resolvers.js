import { getItems, findItem, storeItem } from "./app/helpers/items_resolver_helpers.js";
import { getSuppliers } from "./app/helpers/supplier_resolver_helpers.js";
import { getCategories, storeCategory, destroyCategory, updateCategory } from './app/helpers/categories_resolver_helpers.js';
import { storeSales } from "./app/helpers/sales_resolver_helpers.js";
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
            return await storeSales(args?.sales?.cart);
        }
    }
}