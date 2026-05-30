import type { ReactElement } from "react";

export default function SessionExpiredPage(): ReactElement {
  return (
    <main className="page-shell">
      <div className="auth-card">
        <p className="eyebrow">Session ended</p>
        <h1 className="auth-heading">You&apos;ve been signed out</h1>
        <p className="auth-body">
          Your session expired or was ended on another device. Sign in again to
          continue where you left off.
        </p>
        {/* next param is appended by middleware so the user returns to their intended page */}
        <a href="/login" className="auth-button auth-button--inline">
          Sign in
        </a>
      </div>
    </main>
  );
}
