import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
    Ctx,
    RequestContext,
    Allow,
    Permission,
    Transaction,
    Relations,
    RelationPaths,
    Order,
    OrderService,
} from '@vendure/core';

import { BecknTransactionService } from '../services/beckn-transaction-service';

@Resolver()
export class BecknTransactionResolver {
    constructor(
        private becknTransactionService: BecknTransactionService,
        private orderService: OrderService,
    ) {}

    @Query()
    @Allow(Permission.Public)
    async getBecknTransaction(
        @Ctx() ctx: RequestContext,
        @Args() { becknTransactionId }: { becknTransactionId: string },
    ) {
        return this.becknTransactionService.getBecknTransaction(ctx, becknTransactionId);
    }

    @Query()
    @Allow(Permission.Public)
    async getBecknTransactionFromVendureAuthToken(
        @Ctx() ctx: RequestContext,
        @Args() { vendureAuthToken }: { vendureAuthToken: string },
    ) {
        return this.becknTransactionService.getBecknTransactionFromVendureAuthToken(ctx, vendureAuthToken);
    }

    @Query()
    @Allow(Permission.Public)
    async getBecknOrder(
        @Ctx() ctx: RequestContext,
        @Args() { becknOrderId }: { becknOrderId: string },
        @Relations(Order) relations: RelationPaths<Order>,
    ): Promise<Order | undefined> {
        const becknTransaction = await this.becknTransactionService.getBecknTransactionFromVendureAuthToken(
            ctx,
            becknOrderId,
        );
        if (!becknTransaction || !becknTransaction.vendureOrderId)
            throw new Error('No order id for the given becknOrderId. How did this happen?');
        const order = await this.orderService.findOne(ctx, becknTransaction.vendureOrderId, relations);
        if (order) return order;
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.Public)
    async addBecknTransaction(
        @Ctx() ctx: RequestContext,
        @Args()
        { becknTransactionId, vendureAuthToken }: { becknTransactionId: string; vendureAuthToken: string },
    ) {
        return this.becknTransactionService.setBecknTransaction(ctx, becknTransactionId, vendureAuthToken);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.Public)
    async addVendureOrderIdToBecknTransaction(
        @Ctx() ctx: RequestContext,
        @Args()
        { vendureAuthToken, vendureOrderId }: { vendureAuthToken: string; vendureOrderId: string },
    ) {
        return this.becknTransactionService.addVendureOrderIdToBecknTransaction(
            ctx,
            vendureAuthToken,
            vendureOrderId,
        );
    }
}
