
// Accepts common US formats. Stores E.164 on submit.

export function digitsOnly(s: string) {
  return (s || "").replace(/\D+/g, "");
}

export function validatePhone(input: string): boolean {
  const d = digitsOnly(input);
  if (d.length === 10) return true;                // US without country code
  if (d.length === 11 && d.startsWith("1")) return true; // US with leading 1
  return false;
}

export function normalizePhone(input: string): string {
  const d = digitsOnly(input);
  if (!d) return "";
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return `+${d}`; // last resort, do not block submission
}

// Website: optional. Accept bare domains, www.domain, or full URLs.
const schemeRe = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//;

export function validateUrlLoose(input: string): boolean {
  const v = (input || "").trim();
  if (!v) return true; // optional
  try {
    const test = schemeRe.test(v) ? v : `https://${v}`;
    const u = new URL(test);
    return !!u.hostname && u.hostname.includes(".");
  } catch {
    return false;
  }
}

export function normalizeUrl(input: string): string {
  const v = (input || "").trim();
  if (!v) return "";
  const withScheme = schemeRe.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    // drop trailing slash except root
    const pathname = u.pathname === "/" ? "" : u.pathname;
    return `${u.protocol}//${u.hostname}${pathname}${u.search}${u.hash}`;
  } catch {
    return v;
  }
}
