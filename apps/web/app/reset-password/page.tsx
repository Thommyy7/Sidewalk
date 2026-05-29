"use client";

import { useState, type ReactElement, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import type {
  PasswordResetCompleteRequest,
  PasswordResetCompleteResponse,
  AuthErrorResponse,
} from "@sidewalk/types";

type State = "idle" | "loading" | "done" | "invalid" | "error";

export default function ResetPasswordPage(): ReactElement {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>(token ? "idle" : "invalid");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const els = e.currentTarget.elements;
    const password = (els.namedItem("password") as HTMLInputElement).value;
    const confirm = (els.namedItem("confirm") as HTMLInputElement).value;

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      setState("error");
      return;
    }

    setState("loading");
    const body: PasswordResetCompleteRequest = { token, password };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const err: AuthErrorResponse = await res.json();
        if (err.code === "INVALID_TOKEN" || err.code === "TOKEN_EXPIRED") {
          setState("invalid");
        } else {
          setErrorMsg(err.message);
          setState("error");
        }
        return;
      }

      const _data: PasswordResetCompleteResponse = await res.json();
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
          <p className="eyebrow">All set</p>
          <h1 className="auth-heading">Password updated</h1>
          <p className="auth-body">
            Your password has been changed. You can now sign in with your new
            credentials.
          </p>
          <a href="/login" className="auth-button auth-button--inline">
            Go to sign in
          </a>
        </div>
      </main>
    );
  }

  if (state === "invalid") {
    return (
      <main className="page-shell">
        <div className="auth-card">
          <p className="eyebrow">Link problem</p>
          <h1 className="auth-heading">This link is no longer valid</h1>
          <p className="auth-body">
            Reset links expire after 1 hour and can only be used once. Request
            a new one to continue.
          </p>
          <a href="/forgot-password" className="auth-button auth-button--inline">
            Request a new link
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="auth-card">
        <p className="eyebrow">Account recovery</p>
        <h1 className="auth-heading">Choose a new password</h1>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="auth-label" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="auth-input"
            disabled={state === "loading"}
          />

          <label className="auth-label" htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
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
            {state === "loading" ? "Saving…" : "Set new password"}
          </button>
        </form>
      </div>
    </main>
  );
}
