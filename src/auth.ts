import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { User } from "@/database";
import { connectToDatabase } from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Email and password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const email = typeof credentials?.email === "string"
                    ? credentials.email.trim().toLowerCase()
                    : "";
                const password = typeof credentials?.password === "string"
                    ? credentials.password
                    : "";

                if (!email || !password) {
                    return null;
                }

                await connectToDatabase();
                const user = await User.findOne({ email }).select("+password").lean();

                if (!user || !(await bcrypt.compare(password, user.password))) {
                    return null;
                }

                return { id: user._id.toString(), name: user.name, email: user.email };
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
};

export default NextAuth(authOptions);