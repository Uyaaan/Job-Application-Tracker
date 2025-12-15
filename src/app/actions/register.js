// src/app/actions/register.js
"use server";

import { z } from "zod";

// --- STRICT REGISTRATION SCHEMA ---
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email domain (e.g., .com, .net)"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => !/1234|password|qwerty|admin/i.test(val), {
      message: "Password is too common (avoid '123', 'password')",
    }),
});

export async function registerAction(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  // 1. VALIDATE INPUTS
  const validatedFields = registerSchema.safeParse({ name, email, password });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
      success: false,
      fields: { name, email }, // Send back name/email so they don't re-type
    };
  }

  // 2. CHECK IF USER EXISTS (Mock DB Check)
  // In a real app: await db.user.findUnique({ where: { email } })
  const MOCK_EXISTING_USER = "dev@test.com";

  if (email === MOCK_EXISTING_USER) {
    return {
      errors: { email: "This email is already registered." },
      success: false,
      fields: { name, email },
    };
  }

  // 3. CREATE USER (Mock)
  // await db.user.create({ ... })

  // Return success
  return { success: true };
}
