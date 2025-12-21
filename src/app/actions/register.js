"use server";

import { z } from "zod";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// --- STRICT REGISTRATION SCHEMA ---
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
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

  console.log("1. Received Register Request:", { name, email }); // DEBUG LOG

  const validatedFields = registerSchema.safeParse({ name, email, password });

  if (!validatedFields.success) {
    console.log("2. Validation Failed"); // DEBUG LOG
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

  try {
    await connectDB();
    console.log("3. DB Connected"); // DEBUG LOG

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("4. User already exists"); // DEBUG LOG
      return {
        errors: { email: "This email is already registered." },
        success: false,
        fields: { name, email },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Attempt to create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("5. User Created Successfully:", newUser._id); // DEBUG LOG
    return { success: true };
  } catch (error) {
    console.error("CRITICAL REGISTRATION ERROR:", error); // DEBUG LOG
    return {
      errors: { generic: "Database Error: " + error.message },
      success: false,
      fields: { name, email },
    };
  }
}
