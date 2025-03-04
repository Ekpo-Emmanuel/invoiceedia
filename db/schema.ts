import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, serial, text, timestamp, uuid, decimal, jsonb, date, boolean } from 'drizzle-orm/pg-core'
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

// Payment Terms Enum
export const PaymentTermsEnum = pgEnum('payment_terms', [
  'due_on_receipt',
  'net_15',
  'net_30',
  'net_60'
])

// Line Item Type
export type LineItem = {
  description: string
  quantity: number
  rate: number
}

// Update the Invoices table
export const Invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
  issueDate: date('issue_date').notNull(),
  dueDate: date('due_date').notNull(),
  paymentTerms: PaymentTermsEnum('payment_terms').notNull(),
  notes: text('notes'),
  lineItems: jsonb('line_items').$type<LineItem[]>().notNull(),
  subtotal: integer('subtotal').notNull(),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }),
  taxAmount: integer('tax_amount'),
  total: integer('total').notNull(),
  description: text('description').notNull(),
  userId: text('user_id').notNull(),
  organizationId: text('organization_id').notNull(),
  customerId: uuid('customer_id').notNull().references(() => Customers.id),
  status: StatusEnum('status').notNull(),
  paymentDate: date('payment_date'),
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

export const EmailReminders = pgTable('email_reminders', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  invoiceId: uuid('invoice_id').references(() => Invoices.id, { onDelete: 'cascade' }).notNull(),
  type: text('type', { enum: ['before_due', 'on_due', 'after_due'] }).notNull(),
  days: integer('days').notNull(),
  emailTemplate: text('email_template').notNull(),
  scheduledDate: timestamp('scheduled_date').notNull(),
  sentDate: timestamp('sent_date'),
  status: text('status', { enum: ['scheduled', 'sent', 'failed', 'cancelled'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Add relations for EmailReminders
export const emailRemindersRelations = relations(EmailReminders, ({ one }) => ({
  invoice: one(Invoices, {
    fields: [EmailReminders.invoiceId],
    references: [Invoices.id],
  }),
}));

export const InvoiceTemplates = pgTable('invoice_templates', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  content: text('content').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  category: text('category').notNull(),
  organizationId: text('organization_id').notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});