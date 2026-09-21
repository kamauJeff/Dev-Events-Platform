import CredentialsForm from "@/components/CredentialsForm";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">Join the community</p>
        <h1>Create your DevEvent account</h1>
        <p>Create an account to reserve your spot at developer events.</p>
        <CredentialsForm mode="signup" />
      </section>
    </main>
  );
}