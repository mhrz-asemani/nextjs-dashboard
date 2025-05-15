"use server";
// zod: a TypeScript-first schema declaration and validation library. Instead of using PropTypes,
// you can use zod to define the shape of your data and validate it at runtime.
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// This is a simple example of a Zod schema for an invoice form. It defines the shape of the data
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100; // Convert the amount to cents (e.g., $10.00 becomes 1000)
  const date = new Date().toISOString().split("T")[0]; // Format the date as YYYY-MM-DD

  // Insert the invoice into the database
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (err) {
    console.error(err);
  }

  // Revalidate the path to refresh the data on the client side
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;
  // customer_id is the id of the customer stored in select box form. each customer has a uniqe id
  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (err) {
    // console.error("this my own error");
    throw new Error("update error");
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoice WHERE id = ${id}`;
  } catch (err) {
    // console.error(err);
    throw new Error("Failed to Delete Invoice");
  }

  revalidatePath("/dashboard/invoices");
}
