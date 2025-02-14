import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { AVAILABLE_STATUSES } from '@/app/dashboard/(data)/invoices';

export type Status = typeof AVAILABLE_STATUSES[number]["id"];

const statuses = AVAILABLE_STATUSES.map(({id}) => id) as Array<Status>;
export const StatusEnum = pgEnum('status', ['open', 'paid', 'void', 'uncollectible', 'canceled', 'pending', 'failed']);

// export const StatusEnum = pgEnum('status', statuses as [Status, ...Array<Status>]);

export const Invoices = pgTable('invoices', {
    id: serial('id').primaryKey().notNull(),
    createTs: timestamp('create_ts').defaultNow().notNull(),
    value: integer('value').notNull(),
    description: text('description').notNull(),
    userId: text('userId').notNull(),
    organizationId: text('organizationId'),
    customerId: integer('customerId').notNull().references(() => Customers.id),
    status: StatusEnum('status').notNull(),
});

export const Customers = pgTable('customers', {
    id: serial('id').primaryKey().notNull(),
    createTs: timestamp('create_ts').defaultNow().notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    userId: text('userId').notNull(),
    organizationId: text('organizationId'),
});