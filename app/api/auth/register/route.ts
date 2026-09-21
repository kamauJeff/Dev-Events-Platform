import { registerUser } from "@/lib/actions/auth.action";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await registerUser({
    name: typeof body.name === "string" ? body.name : "",
    email: typeof body.email === "string" ? body.email : "",
    password: typeof body.password === "string" ? body.password : "",
  });

  return Response.json(result, { status: result.success ? 201 : 400 });
}