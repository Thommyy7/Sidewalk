import type { ReactElement } from "react";
import Link from "next/link";

export default function VerifyEmailPage(): ReactElement {
  return (
    <main className="page-shell">
      <div className="auth-card">
        <p className="eyebrow">Almost there</p>
        <h1 className="auth-heading">Check your inbox</h1>
        <p className="auth-body">
          We sent a verification link to your email address. Click it to
          activate your account. The link expires in 24 hours.
        </p>
        <p className="auth-body">
          Didn&apos;t receive it? Check your spam folder. Resend will be
          available once the API supports it.
        </p>
        <p className="auth-hint">
          Already verified?{" "}
          <Link href="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
