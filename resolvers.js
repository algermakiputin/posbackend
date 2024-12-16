import { getItems, findItem } from "./app/helpers/items_resolver_helpers.js";
import { getSuppliers } from "./app/helpers/supplier_resolver_helpers.js";
import { getCategories } from './app/helpers/categories_resolver_helpers.js';
export const resolvers = {
    Query: {
        items: async () => {
            return await getItems();
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
        deleteItem(_, args) {
            // deleting the item;
        }
    },  
    // Item: {
    //     items(parent) {
    //         console.log(`parent`, parent);
    //     }
    // }
}