import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { AVAILABLE_STATUSES } from '@/app/dashboard/(data)/invoices';

export type Status = typeof AVAILABLE_STATUSES[number]["id"];

const statuses = AVAILABLE_STATUSES.map(({id}) => id) as Array<Status>;
export const StatusEnum = pgEnum('status', ['open', 'paid', 'void', 'uncollectible', 'canceled', 'pending', 'failed']);

// export const StatusEnum = pgEnum('status', statuses as [Status, ...Array<Status>]);


export const Customers = pgTable('customers', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    companyName: text('company_name'),
    email: text('email').notNull(),
    phone: text('phone'),
    street: text('street'),
    city: text('city'),
    zip: text('zip'),
    state: text('state'),
    country: text('country'),
    notes: text('notes'),
    userId: text('user_id').notNull(),
    organizationId: text('organization_id').notNull(),
    createTs: timestamp('create_ts').defaultNow().notNull(),
});

export const Invoices = pgTable('invoices', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    createTs: timestamp('create_ts').defaultNow().notNull(),
    value: integer('value').notNull(),
    description: text('description').notNull(),
    userId: text('userId').notNull(),
    organizationId: text('organizationId'),
    customerId: uuid('customerId').notNull().references(() => Customers.id),
    status: StatusEnum('status').notNull(),
});

// Define the relations
export const customersRelations = relations(Customers, ({ many }) => ({
    invoices: many(Invoices),
}));

export const invoicesRelations = relations(Invoices, ({ one }) => ({
    customer: one(Customers, {
        fields: [Invoices.customerId],
        references: [Customers.id],
    }),
}));