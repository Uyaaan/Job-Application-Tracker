"use server";

import { z } from "zod";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

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

  // 1. VALIDATE INPUTS (Your original Zod logic)
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
      fields: { name, email },
    };
  }

  // 2. CONNECT TO DB
  await connectDB();

  // 3. CHECK IF USER EXISTS
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return {
      errors: { email: "This email is already registered." },
      success: false,
      fields: { name, email },
    };
  }

  // 4. HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. CREATE USER
  try {
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return { success: true };
  } catch (error) {
    return {
      errors: { generic: "Something went wrong. Please try again." },
      success: false,
      fields: { name, email },
    };
  }
}
