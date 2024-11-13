// app/actions/auth.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  comparePasswords,
  createSession,
  validateSession,
} from "@/lib/auth";
import { USER_ROLES } from "@/types/auth";
import type { UserRole, User, Session } from "@/types/auth";

interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole; // Change to UserRole type
  companyName?: string;
  companyAddress?: string;
  contactNumber?: string;
}

interface SignInData {
  email: string;
  password: string;
}

export async function signUp(data: SignUpData) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "Email already registered" };
    }

    const hashedPassword = await hashPassword(data.password);

    // Create user with proper role validation
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        contactNumber: data.contactNumber,
      },
    });

    // Create session with proper UserRole type
    const session = await createSession(user.id, user.role as UserRole);

    // Set up initial client relationships if needed
    if (data.role === USER_ROLES.BROKER || data.role === USER_ROLES.CLIENT) {
      // You might want to create initial consignee/exporter records
      // based on the company information provided
      if (data.companyName) {
        await prisma.consignee.create({
          data: {
            name: data.companyName,
            registeredName: data.companyName,
            businessAddress: data.companyAddress || "",
            tin: "", // You might want to add these to SignUpData
            brn: "",
            contactPerson: data.name,
            contactNumber: data.contactNumber || "",
            email: data.email,
            userId: user.id,
          },
        });
      }
    }

    revalidatePath("/admin/clients");
    revalidatePath("/admin/services/import");

    return { success: true, user, session };
  } catch (error) {
    console.error("SignUp error:", error);
    return { error: "Failed to create account" };
  }
}

export async function signIn(data: SignInData) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        consignees: {
          take: 1, // Just to check if any exist
        },
        exporters: {
          take: 1, // Just to check if any exist
        },
      },
    });

    if (!user) {
      return { error: "Invalid credentials" };
    }

    const isValid = await comparePasswords(data.password, user.password);

    if (!isValid) {
      return { error: "Invalid credentials" };
    }

    const session = await createSession(user.id, user.role as UserRole);

    return {
      success: true,
      session,
      role: user.role,
      hasClients: user.consignees.length > 0 || user.exporters.length > 0,
    };
  } catch (error) {
    console.error("SignIn error:", error);
    return { error: "Failed to sign in" };
  }
}

export async function validateSessionAction(): Promise<Session | null> {
  try {
    const session = await validateSession();
    return session;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}

export async function signOutAction() {
  try {
    const cookieStore = await cookies();
    // Use set with expired date to remove the cookie
    cookieStore.set("session", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    revalidatePath("/admin/clients");
    revalidatePath("/admin/services/import");

    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out" };
  }
}

export async function createInitialSuperAdmin() {
  try {
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: USER_ROLES.SUPERADMIN },
    });

    if (existingSuperAdmin) {
      return { error: "Super admin already exists" };
    }

    const hashedPassword = await hashPassword("superadmin123");

    await prisma.user.create({
      data: {
        email: "superadmin@clexcb.com",
        name: "Super Admin",
        password: hashedPassword,
        role: USER_ROLES.SUPERADMIN as UserRole,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Create super admin error:", error);
    return { error: "Failed to create super admin" };
  }
}

// New helper function to check user permissions
export async function checkUserPermissions(userId: string, entityId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        consignees: {
          where: { id: entityId },
        },
        exporters: {
          where: { id: entityId },
        },
      },
    });

    if (!user) return false;

    // Super admin has access to everything
    if (user.role === USER_ROLES.SUPERADMIN) return true;

    // Check if the entity belongs to the user
    return user.consignees.length > 0 || user.exporters.length > 0;
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
}
