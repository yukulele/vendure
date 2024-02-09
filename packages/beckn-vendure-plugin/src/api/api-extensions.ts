import gql from 'graphql-tag';

export const shopApiExtensions = gql`
    type BecknTransaction implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        becknTransactionId: String!
        vendureAuthToken: String!
        vendureOrderId: String
    }

    type ProductVariantWithChannelAndSeller implements Node {
        channels: [Channel]
        id: ID!
        name: String
    }

    type ProductVariantWithChannelAndSellerList implements PaginatedList {
        items: [ProductVariantWithChannelAndSeller!]!
        totalItems: Int!
    }

    extend type Query {
        getBecknTransaction(becknTransactionId: String!): BecknTransaction
        getBecknTransactionFromVendureAuthToken(vendureAuthToken: String!): BecknTransaction
        getBecknOrder(becknOrderId: String!): Order
        getSellersOfProductVariants(
            options: ProductVariantListOptions
            productId: ID
        ): ProductVariantWithChannelAndSellerList!
    }

    extend type Mutation {
        addBecknTransaction(becknTransactionId: String!, vendureAuthToken: String!): BecknTransaction!
        addVendureOrderIdToBecknTransaction(
            vendureAuthToken: String!
            vendureOrderId: String!
        ): BecknTransaction!
        cancelBecknOrder(becknOrderId: String!, reason: String!, cancelShipping: Boolean): Order
    }
`;
