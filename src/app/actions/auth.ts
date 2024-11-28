// src/app/actions/auth
'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { 
  hashPassword, 
  comparePasswords, 
  createSessionToken,
  getSessionCookieOptions,
  getUserFromSession
} from '@/lib/auth'
import type { SignInData, SignUpData, AuthResponse, Session, UserRole } from '@/types/auth'
import { prisma } from '@/lib/prisma'
import { USER_ROLES } from '@/types/auth'

export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    console.log('SignUp data received:', data); // Debug log

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const hashedPassword = await hashPassword(data.password);

    // Log validation before transaction
    console.log('Starting user creation with role:', data.role);

    // Create user with transaction to handle related records
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          role: data.role,
          isActive: true,
          profile: {
            tin: data.tin,
            brn: data.brn,
            industryType: data.industryType
          }
        }
      });

      console.log('User created:', user); // Debug log

      // Create client/broker specific records
      if (data.role === USER_ROLES.CLIENT) {
        const client = await tx.client.create({
          data: {
            userId: user.id,
            type: 'IMPORTER',
            name: data.name,
            registeredName: data.companyName || data.name,
            businessAddress: data.companyAddress || '',
            contactPerson: data.name,
            contactNumber: data.contactNumber || '',
            email: data.email,
            tinNumber: data.tin || '',
            isActive: true,
            taxSettings: {},
            creditSettings: {}
          }
        });
        console.log('Client record created:', client); // Debug log

      } else if (data.role === USER_ROLES.BROKER) {
        const broker = await tx.broker.create({
          data: {
            userId: user.id,
            employeeId: `BR${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            designation: 'Customs Broker',
            specialization: [],
            isActive: true
          }
        });
        console.log('Broker record created:', broker); // Debug log
      }

      return user;
    });

    // Create session token and set cookie
    const token = await createSessionToken({
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role as UserRole,
      isActive: result.isActive
    });

    const cookieOptions = getSessionCookieOptions();
    cookies().set({
      name: cookieOptions.name,
      value: token,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      maxAge: cookieOptions.maxAge,
      path: cookieOptions.path
    });

    const session = await getUserFromSession();

    revalidatePath("/admin/clients");
    revalidatePath("/admin/services/import");

    return { 
      success: true,
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
        isActive: result.isActive
      }
    };
  } catch (error) {
    console.error("SignUp error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function signIn(data: SignInData): Promise<AuthResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValid = await comparePasswords(data.password, user.password);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive
    });

    // Set cookie with proper await
    const cookieStore = await cookies();
    const cookieOptions = getSessionCookieOptions();
    
    // Create cookie response
    await cookieStore.set({
      name: cookieOptions.name,
      value: token,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      maxAge: cookieOptions.maxAge,
      path: cookieOptions.path
    });

    const session = await getUserFromSession();
    
    return { 
      success: true, 
      session: session || undefined,
      user: session?.user,
      role: user.role
    };
  } catch (error) {
    console.error('SignIn error:', error);
    return { success: false, error: 'An error occurred during sign in' };
  }
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieOptions = getSessionCookieOptions();
    cookies().set({
      name: cookieOptions.name,
      value: '',
      expires: new Date(0),
      path: '/'
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
      where: { role: USER_ROLES.SUPERADMIN }
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
        role: USER_ROLES.SUPERADMIN,
        isActive: true
      }
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
    // First check if user exists and get their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) return false;

    // Super admin has access to everything
    if (user.role === USER_ROLES.SUPERADMIN) return true;

    // For clients, check if they own the entity
    if (user.role === USER_ROLES.CLIENT) {
      const clientEntity = await prisma.client.findFirst({
        where: {
          AND: [
            { userId: userId },
            { id: entityId }
          ]
        }
      });
      return clientEntity !== null;
    }

    // For brokers, check if they own the entity
    if (user.role === USER_ROLES.BROKER) {
      const brokerEntity = await prisma.broker.findFirst({
        where: {
          AND: [
            { userId: userId },
            { id: entityId }
          ]
        }
      });
      return brokerEntity !== null;
    }

    return false;
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
}