"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
    const mailto = `mailto:chair@scra.co.ke?subject=${encodeURIComponent(
      subject || "Message from SCRA website"
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm p-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-6 py-3 hover:bg-primary-dark transition-colors"
      >
        Send Message
      </button>
      <p className="text-xs text-muted-foreground">
        This opens your email app with your message pre-filled, addressed to
        SCRA&apos;s chairperson.
      </p>
    </form>
  );
}
