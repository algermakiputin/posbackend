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
        capital: Float
        supplier_id: String
        category_id: String
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
        image: String
    }
    input SupplierInput {
        name: String,
    }
    type ItemsResponse {
        data: [Item]
        count: Int
    }
    type TransactionDetails {
        transaction_number: String
        total: Int
        totalItems: Int
        customer_name: String
    }
    type SalesResponse {
        totalEarnings: String,
        itemSold: String,
        netSales: String,
        transactions: [TransactionDetails]
    }
    type Query {
        items(filter: ItemFilter): ItemsResponse
        item(id: ID): Item
        categories: [Category]
        suppliers: [Supplier]
        getSales: SalesResponse
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
        barcode: String
        capital: Float
    }
    input SupplierInput {
        name: String
        contact: String
        address: String
        email: String
    }
    type Mutation {
        storeItem(item: ItemInput!): GenericRepose
        updateItem(editItemInput: EditItemInput): GenericRepose
        destroyItem(id: ID!): GenericRepose
        storeCategory(category: CategoryInput): GenericRepose
        destroyCategory(id: ID!): GenericRepose
        updateCategory(category: CategoryInput): Boolean
        storeSupplier(supplier: SupplierInput): GenericRepose
        storeSales(sales: SalesInput): GenericRepose
        destroySupplier(id: ID!): GenericRepose
    }
    input EditItemInput {
        id: ID!
        barcode: String
        name: String
        description: String
        price: Float
        stocks: Int
        capital: Float
        image: String
        supplier_id: String
        category_id: String
    }
`;