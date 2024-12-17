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
    input ItemInput {
        name: String, 
        description: String,
        price: Float,
        capital: Float
        stocks: Int,
        categoryId: String
        supplierId: String
    }
    input SupplierInput {
        name: String,
    }
    type Query {
        items(filter: ItemFilter): [Item]
        item(id: ID): Item
        categories: [Category]
        suppliers: [Supplier]
    }
    type GenericRepose {
        success: Boolean,
        message: String,
        data: String
    }
    type Mutation {
        storeItem(item: ItemInput!): Boolean
        updateItem(id: ID!, editItemInput: EditItemInput): Item
        destroyItem(id: ID!): GenericRepose
        storeCategory(category: CategoryInput): Int
        destroyCategory(id: ID!): Boolean
        updateCategory(category: CategoryInput): Boolean
        storeSupplier(supplier: SupplierInput): GenericRepose
    }
    input EditItemInput {
        name: String,
        description: String,
        price: Float,
        stocks: Int
    }
`;