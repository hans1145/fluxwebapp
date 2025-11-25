// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password } = body;

    // cek input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // cek email sudah ada?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[REGISTER_ERROR]", err);
    return NextResponse.json(
      { message: "Registrasi gagal", error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
