export const resolvers = {
    Query: {
        items: () => {},
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
    Item: {
        items(parent) {
            console.log(`parent`, parent);
        }
    }
}