"use server"

import { db } from "@/db"
import { InvoiceTemplates } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { eq, and, not } from "drizzle-orm"

interface InvoiceTemplate {
  id: string
  name: string
  description: string | null
  content: string
  isDefault: boolean
  category: string
  userId: string
  organizationId: string
  createdAt: Date
  updatedAt: Date
}

interface CreateTemplateParams {
  name: string
  description?: string | null
  content: string
  isDefault: boolean
  category: string
  organizationId: string
  organizationSlug: string
}

interface UpdateTemplateParams extends CreateTemplateParams {
  id: string
}

export async function getInvoiceTemplates(organizationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const templates = await db.query.InvoiceTemplates.findMany({
      where: and(
        eq(InvoiceTemplates.organizationId, organizationId),
        eq(InvoiceTemplates.userId, userId)
      ),
    })
    return templates
  } catch (error) {
    console.error("Error fetching invoice templates:", error)
    throw new Error("Failed to fetch invoice templates")
  }
}

export async function createInvoiceTemplate(params: CreateTemplateParams) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    // If this is set as default, unset any existing default template
    if (params.isDefault) {
      await db
        .update(InvoiceTemplates)
        .set({ isDefault: false })
        .where(and(
          eq(InvoiceTemplates.organizationId, params.organizationId),
          eq(InvoiceTemplates.userId, userId),
          eq(InvoiceTemplates.isDefault, true)
        ))
    }

    const [template] = await db.insert(InvoiceTemplates).values({
      name: params.name,
      description: params.description || null,
      content: params.content,
      isDefault: params.isDefault,
      category: params.category,
      organizationId: params.organizationId,
      userId: userId,
    }).returning()

    revalidatePath(`/${params.organizationSlug}/settings`)
    return template
  } catch (error) {
    console.error("Error creating invoice template:", error)
    throw new Error("Failed to create invoice template")
  }
}

export async function updateInvoiceTemplate(params: UpdateTemplateParams) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    // If this is set as default, unset any existing default template
    if (params.isDefault) {
      await db
        .update(InvoiceTemplates)
        .set({ isDefault: false })
        .where(and(
          eq(InvoiceTemplates.organizationId, params.organizationId),
          eq(InvoiceTemplates.userId, userId),
          eq(InvoiceTemplates.isDefault, true),
          not(eq(InvoiceTemplates.id, params.id))
        ))
    }

    const [template] = await db
      .update(InvoiceTemplates)
      .set({
        name: params.name,
        description: params.description || null,
        content: params.content,
        isDefault: params.isDefault,
        category: params.category,
        updatedAt: new Date(),
      })
      .where(and(
        eq(InvoiceTemplates.id, params.id),
        eq(InvoiceTemplates.organizationId, params.organizationId),
        eq(InvoiceTemplates.userId, userId)
      ))
      .returning()

    revalidatePath(`/${params.organizationSlug}/settings`)
    return template
  } catch (error) {
    console.error("Error updating invoice template:", error)
    throw new Error("Failed to update invoice template")
  }
}

export async function deleteInvoiceTemplate(id: string, organizationId: string, organizationSlug: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    await db
      .delete(InvoiceTemplates)
      .where(and(
        eq(InvoiceTemplates.id, id),
        eq(InvoiceTemplates.organizationId, organizationId),
        eq(InvoiceTemplates.userId, userId)
      ))

    revalidatePath(`/${organizationSlug}/settings`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting invoice template:", error)
    throw new Error("Failed to delete invoice template")
  }
} 