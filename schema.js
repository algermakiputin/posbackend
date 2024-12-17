export const typeDefs = `#graphql
    type Item {
        id: ID,
        name: String,
        description: String,
        price: Float,
        stocks: Int
        categoryName: String
        supplierName: String
    }
    type Category {
        id: ID,
        name: String,
        description: String
    }
    type Supplier {
        id: ID,
        name: String,
        address: String,
        phone: String,
        email: String
    }
    input ItemFilter {
        query: String
    }
    input CategoryInput {
        name: String,
        description: String
        id: ID
    }
    type Query {
        items(filter: ItemFilter): [Item]
        item(id: ID): Item
        categories: [Category]
        suppliers: [Supplier]
    }
    type Mutation {
        deleteItem(id: ID!): [Item]
        updateItem(id: ID!, editItemInput: EditItemInput): Item
        storeCategory(category: CategoryInput): Int
        destroyCategory(id: ID!): Boolean
        updateCategory(category: CategoryInput): Boolean
    }
    input EditItemInput {
        name: String,
        description: String,
        price: Float,
        stocks: Int
    }
`;