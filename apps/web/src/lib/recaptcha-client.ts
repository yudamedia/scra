declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Resolves once the globally-loaded reCAPTCHA v3 script (see the
 * next/script tag in the frontend root layout) is ready, then executes it
 * for the given action and returns the token to submit alongside the form.
 */
export function getRecaptchaToken(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      reject(new Error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set"));
      return;
    }
    if (!window.grecaptcha) {
      reject(new Error("reCAPTCHA script not loaded yet"));
      return;
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha!.execute(siteKey, { action }).then(resolve, reject);
    });
  });
}
