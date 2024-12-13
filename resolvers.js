import { getItems } from "./app/helpers/resolver_helpers.js";

export const resolvers = {
    Query: {
        items: async () => {
            const items = await getItems();
            return items;
        },
        item: (_, args) => {
            return {
                name: "Alger",
                price: 25,
                stocks: 50
            };
        },
        categories: () => {},
        suppliers: () => {},
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