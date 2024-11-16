export const typeDefs = `#graphql
    type Item {
        id: ID,
        name: String,
        description: String,
        price: Float,
        stocks: Int
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
    type Query {
        items: [Item]
        item(id: ID): Item
        categories: [Category]
        suppliers: [Supplier]
    }
    type Mutation {
        deleteItem(id: ID!): [Item]
        updateItem(id: ID!, editItemInput: EditItemInput): Item
    }
    input EditItemInput {
        name: String,
        description: String,
        price: Float,
        stocks: Int
    }
`;