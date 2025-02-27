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
        image: String
    }
    type Category {
        id: ID
        name: String
        itemCount: Int
    }
    type Supplier {
        id: ID
        name: String
        address: String
        contact: String
        email: String
    }
    input ItemFilter {
        query: String
        categories: [String]
        suppliers: [String]
        limit: Int
        storeId: ID
    }
    input CategoryInput {
        name: String,
        description: String
        id: ID
        store_id: ID
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
        storeId: String
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
        date_time: String
    }
    type SalesResponse {
        totalEarnings: String,
        itemSold: String,
        netSales: String,
        transactions: [TransactionDetails]
    }
    type InventorySummaryResponse {
        totalItems: Float
        capital: Float
        categories: Float
        value: Float
    }
    type SalesOverViewResponse {
        data: [Float]
        keys: [String]
    }
    type SalesDetails {
        name: String
        price: Float 
        capital: Float
        quantity: Int
        created_at: String
    }
    input getSalesInput {
        dateRange: String
        storeId: ID
    }
    type Query {
        items(filter: ItemFilter): ItemsResponse
        item(id: ID): Item
        categories(storeId: ID): [Category]
        category(id: ID): Category
        suppliers(storeId: ID): [Supplier]
        supplier(id: ID): Supplier
        getSales(filter: getSalesInput): SalesResponse
        inventorySummary(storeId: ID): InventorySummaryResponse
        getSalesOverview(storeId: ID): SalesOverViewResponse
        getSalesDetails(transaction_number: String): [SalesDetails]
        getUsers(adminId: ID): [User]
        user(userId: ID): User
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
        storeId: ID
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
        store_id: ID
    }
    input SupplierUpdateInput {
        name: String
        contact: String
        address: String
        email: String
        id: ID
    }
    input UserInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        confirmPassword: String!
        staff: ID
        admin_id: ID
    }
    type User {
        id: String
        email: String
        token: String
        firstName: String
        lastName: String
        storeId: ID
    }
    input LoginInput {
        email: String
        password: String
    }
    input UpdateUserInput {
        firstName: String
        lastName: String
        email: String
        password: String
        confirmPassword: String
        id: ID!
    }
    type Mutation {
        storeItem(item: ItemInput!): GenericRepose
        updateItem(editItemInput: EditItemInput): GenericRepose
        destroyItem(id: ID!): GenericRepose
        storeCategory(category: CategoryInput): GenericRepose
        destroyCategory(id: ID!): GenericRepose
        updateCategory(category: CategoryInput): GenericRepose
        storeSupplier(supplier: SupplierInput): GenericRepose
        updateSupplier(supplier: SupplierUpdateInput): GenericRepose
        storeSales(sales: SalesInput): GenericRepose
        destroySupplier(id: ID!): GenericRepose
        register(user: UserInput): User
        login(user: LoginInput): User
        updateUser(user: UpdateUserInput): GenericRepose
        destroyUser(id: ID): GenericRepose
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