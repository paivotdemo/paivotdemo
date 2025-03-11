import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, status, institution } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const name = `${firstName} ${lastName}`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status,
        institution,
      },
    });

    const { password: _, ...userWithoutPass } = user;

    return NextResponse.json(
      { 
        user: userWithoutPass,
        message: "User created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
} 