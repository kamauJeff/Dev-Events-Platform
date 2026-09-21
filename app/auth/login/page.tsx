import CredentialsForm from "@/components/CredentialsForm";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">Welcome back</p>
        <h1>Log in to DevEvent</h1>
        <p>Log in with the email and password you used to create your account.</p>
        <CredentialsForm mode="login" />
      </section>
    </main>
  );
}