"use client";

import { useState, type ReactElement, type FormEvent } from "react";
import type {
  PasswordResetRequestRequest,
  PasswordResetRequestResponse,
  AuthErrorResponse,
} from "@sidewalk/types";

type State = "idle" | "loading" | "done" | "error";

export default function ForgotPasswordPage(): ReactElement {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const body: PasswordResetRequestRequest = { email };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const err: AuthErrorResponse = await res.json();
        setErrorMsg(err.message);
        setState("error");
        return;
      }

      const _data: PasswordResetRequestResponse = await res.json();
      setState("done");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <main className="page-shell">
        <div className="auth-card">
          <p className="eyebrow">Request sent</p>
          <h1 className="auth-heading">Check your inbox</h1>
          <p className="auth-body">
            If that address is registered, a reset link is on its way. Check
            your spam folder if it doesn&apos;t arrive within a few minutes.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="auth-card">
        <p className="eyebrow">Account recovery</p>
        <h1 className="auth-heading">Reset your password</h1>
        <p className="auth-body">
          Enter your email and we&apos;ll send a reset link. We won&apos;t
          confirm whether the address is registered.
        </p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="auth-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="auth-input"
            disabled={state === "loading"}
          />

          {state === "error" && (
            <p className="auth-error" role="alert">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={state === "loading"}
          >
            {state === "loading" ? "Sending…" : "Send reset link"}
          </button>
        </form>
      </div>
    </main>
  );
}
