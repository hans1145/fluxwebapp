// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Activity from "@/models/Activity";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Email tidak terdaftar" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Password salah" },
        { status: 400 }
      );
    }

    // bikin JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    
    await Activity.create({
      userId: user._id,
      action: "LOGIN",
      metadata: {},
    });

    return NextResponse.json(
      {
        message: "Login berhasil",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[LOGIN_ERROR]", err);
    return NextResponse.json(
      { message: "Login gagal", error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
