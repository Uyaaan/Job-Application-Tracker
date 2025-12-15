// src/app/actions/login.js
"use server";

import { signIn } from "@/auth";
import { z } from "zod";
import { AuthError } from "next-auth";

const rateLimitMap = new Map();
const TIMEOUTS = [5, 10, 30, 60, 120];

// Simple Schema (No complexity checks)
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // 1. RATE LIMIT CHECK
  const record = rateLimitMap.get(email) || { count: 0, unlockTime: 0 };

  // If currently locked
  if (Date.now() < record.unlockTime) {
    const secondsLeft = Math.ceil((record.unlockTime - Date.now()) / 1000);
    return {
      // Return the raw number so the button can count it down
      lockout: secondsLeft,
      errors: {}, // No text error needed, the button handles it
      success: false,
      fields: { email },
    };
  }

  // 2. INPUT VALIDATION
  const validatedFields = loginSchema.safeParse({ email, password });
  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
      success: false,
      fields: { email },
    };
  }

  // 3. MOCK DB CHECK (Specific Errors)
  const MOCK_USER_EMAIL = "dev@test.com";
  const MOCK_USER_PASS = "123";
  let specificError = null;

  if (email !== MOCK_USER_EMAIL) {
    specificError = { email: "Email not found" };
  } else if (password !== MOCK_USER_PASS) {
    specificError = { password: "Password is incorrect" };
  }

  if (specificError) {
    const newCount = record.count + 1;
    let newUnlockTime = 0;
    let lockoutDuration = 0;

    // Lock logic: Lock on 3rd, 6th, 9th attempts...
    if (newCount > 0 && newCount % 3 === 0) {
      const tierIndex = newCount / 3 - 1;
      lockoutDuration = TIMEOUTS[tierIndex] || TIMEOUTS[TIMEOUTS.length - 1];
      newUnlockTime = Date.now() + lockoutDuration * 1000;
    }

    rateLimitMap.set(email, { count: newCount, unlockTime: newUnlockTime });

    // If we triggered a lock, return the lockout time instead of the field error
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

  // 4. ATTEMPT LOGIN
  try {
    await signIn("credentials", { email, password, redirect: false });
    rateLimitMap.delete(email);
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
