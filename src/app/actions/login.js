"use server";

import { signIn } from "@/auth";
import { z } from "zod";
import { AuthError } from "next-auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const rateLimitMap = new Map();
const TIMEOUTS = [5, 10, 30, 60, 120];

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // 1. RATE LIMIT CHECK (Keep your existing logic)
  const record = rateLimitMap.get(email) || { count: 0, unlockTime: 0 };
  if (Date.now() < record.unlockTime) {
    const secondsLeft = Math.ceil((record.unlockTime - Date.now()) / 1000);
    return {
      lockout: secondsLeft,
      errors: {},
      success: false,
      fields: { email },
    };
  }

  // 2. INPUT VALIDATION
  const validatedFields = loginSchema.safeParse({ email, password });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors, // simplified
      success: false,
      fields: { email },
    };
  }

  // 3. REAL DB CHECK (Replaces Mock Logic)
  await connectDB();
  const user = await User.findOne({ email });

  let specificError = null;

  if (!user) {
    specificError = { email: "Email not found" };
  } else {
    // Check password manually just to give specific error message
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      specificError = { password: "Password is incorrect" };
    }
  }

  if (specificError) {
    // --- YOUR RATE LIMIT LOGIC ---
    const newCount = record.count + 1;
    let newUnlockTime = 0;
    let lockoutDuration = 0;

    if (newCount > 0 && newCount % 3 === 0) {
      const tierIndex = newCount / 3 - 1;
      lockoutDuration = TIMEOUTS[tierIndex] || TIMEOUTS[TIMEOUTS.length - 1];
      newUnlockTime = Date.now() + lockoutDuration * 1000;
    }

    rateLimitMap.set(email, { count: newCount, unlockTime: newUnlockTime });

    if (lockoutDuration > 0) {
      return {
        lockout: lockoutDuration,
        errors: {},
        success: false,
        fields: { email },
      };
    }

    return {
      errors: specificError,
      success: false,
      fields: { email },
    };
  }

  // 4. ATTEMPT LOGIN (This actually creates the session)
  try {
    await signIn("credentials", { email, password, redirect: false });
    rateLimitMap.delete(email); // Success! Clear rate limit
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: { generic: "Auth failed" },
        success: false,
        fields: { email },
      };
    }
    throw error;
  }
}
