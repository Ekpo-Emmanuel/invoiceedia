import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'


export const StatusEnum = pgEnum('status', ['open', 'canceled', 'uncollectible', 'pending', 'paid', 'failed'])

export const Invoices = pgTable('invoices', {
    id: serial('id').primaryKey().notNull(),
    createTs: timestamp('create_ts').defaultNow().notNull(),
    value: integer('value').notNull(),
    description: text('description').notNull(),
    status: text('status').notNull(),
});