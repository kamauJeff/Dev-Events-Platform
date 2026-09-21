"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type CredentialsFormProps = {
  mode: "login" | "signup";
};

const CredentialsForm = ({ mode }: CredentialsFormProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (isSignup) {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error ?? "Account creation failed.");
        setIsSubmitting(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    router.push(result?.url ?? "/");
    router.refresh();
  };

  return (
    <form className="credentials-form" onSubmit={handleSubmit}>
      {isSignup && (
        <div>
          <label htmlFor="name">Full name</label>
          <input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
      )}
      <div>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" className="auth-button" disabled={isSubmitting}>
        {isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Log in"}
      </button>
    </form>
  );
};

export default CredentialsForm;