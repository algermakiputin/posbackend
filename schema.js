export const typeDefs = `#graphql
    type Item {
        id: ID,
        name: String,
        description: String,
        price: Float,
        stocks: Int
        categoryName: String
        supplierName: String
        barcode: String
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
        query: String,
        categories: [String]
        suppliers: [String]
    }
    input CategoryInput {
        name: String,
        description: String
        id: ID
    }
    input ItemInput {
        barcode: String
        name: String, 
        description: String,
        price: String,
        capital: String
        stocks: Int,
        category_id: String
        supplier_id: String
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
    input SalesInput {
        cart: Cart
        customerId: Int
        customerName: String
    }
    input Cart {
        lineItems: [lineItem]
    }
    input lineItem {
        itemId: String
        name: String
        price: Int
        quantity: Int
    }
    type Mutation {
        storeItem(item: ItemInput!): GenericRepose
        updateItem(id: ID!, editItemInput: EditItemInput): Item
        destroyItem(id: ID!): GenericRepose
        storeCategory(category: CategoryInput): Int
        destroyCategory(id: ID!): Boolean
        updateCategory(category: CategoryInput): Boolean
        storeSupplier(supplier: SupplierInput): GenericRepose
        storeSales(sales: SalesInput): GenericRepose
    }
    input EditItemInput {
        name: String,
        description: String,
        price: Float,
        stocks: Int
    }
`;