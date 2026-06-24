import { Resend } from "resend";

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — email notifications disabled.");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = "All Star Champions <onboarding@resend.dev>";

// ─── Shared layout ────────────────────────────────────────────────────────────

function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-top:4px solid #FFD700;">
        <!-- Header -->
        <tr>
          <td style="background:#0A1628;padding:28px 32px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.3em;color:#FFD700;text-transform:uppercase;">All Star Champions</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:0.05em;text-transform:uppercase;">5-a-Side Soccer Tournament</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:32px;">${body}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#0A1628;padding:20px 32px;">
            <p style="margin:0;font-size:12px;color:#ffffff;opacity:0.6;">
              All Star Champions &bull; SoFive, 2015 Pitkin Ave, Brooklyn, NY 11207<br/>
              Phone: 929-304-3899 &bull; Instagram: @all_star_champions
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function goldDivider(): string {
  return `<div style="height:3px;background:#FFD700;margin:24px 0;"></div>`;
}

function playerList(players: string[]): string {
  const items = players
    .map(
      (p, i) =>
        `<tr><td style="padding:6px 12px;font-size:14px;color:#0A1628;border-bottom:1px solid #f0f0f0;">
          <span style="color:#FFD700;font-weight:700;margin-right:8px;">${i + 1}.</span>${p}
        </td></tr>`,
    )
    .join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;margin-top:8px;">${items}</table>`;
}

// ─── 1. Team Registration Confirmation ────────────────────────────────────────

export async function sendRegistrationConfirmation(
  captainEmail: string,
  teamName: string,
  captainName: string,
  players: string[],
): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.log("[email] Skipping registration confirmation — no API key.");
    return { ok: false, error: "Email not configured" };
  }

  const body = `
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0A1628;text-transform:uppercase;">Registration Received!</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#444;">
      Hi <strong>${captainName}</strong>, your team has been submitted for the All Star Champions tournament.
    </p>
    ${goldDivider()}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:8px 0;font-size:13px;font-weight:700;color:#0A1628;text-transform:uppercase;letter-spacing:0.05em;width:140px;">Team Name</td>
        <td style="padding:8px 0;font-size:14px;color:#333;">${teamName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:13px;font-weight:700;color:#0A1628;text-transform:uppercase;letter-spacing:0.05em;">Captain</td>
        <td style="padding:8px 0;font-size:14px;color:#333;">${captainName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:13px;font-weight:700;color:#0A1628;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;">Players (${players.length})</td>
        <td style="padding:8px 0;">${playerList(players)}</td>
      </tr>
    </table>
    ${goldDivider()}
    <div style="background:#fffbea;border-left:4px solid #FFD700;padding:14px 16px;margin-bottom:20px;">
      <p style="margin:0;font-size:14px;color:#0A1628;">
        <strong>Status: Pending Admin Approval</strong><br/>
        Your registration has been received and is currently under review. You will receive another email once an admin approves or denies your team.
      </p>
    </div>
    <p style="font-size:13px;color:#666;">
      Questions? Reach us at <strong>929-304-3899</strong> or DM us on Instagram <strong>@all_star_champions</strong>.
    </p>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: captainEmail,
      subject: `Registration Received — ${teamName} | All Star Champions`,
      html: emailWrapper(body),
    });
    if (error) {
      console.error("[email] Resend error (registration):", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] Failed to send registration confirmation:", err);
    return { ok: false, error: String(err) };
  }
}

// ─── 2. Team Approval / Denial Notification ───────────────────────────────────

export async function sendTeamStatusNotification(
  captainEmail: string,
  teamName: string,
  captainName: string,
  status: "approved" | "denied",
  reason?: string,
): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.log("[email] Skipping status notification — no API key.");
    return { ok: false, error: "Email not configured" };
  }

  const isApproved = status === "approved";

  const body = isApproved
    ? `
      <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0A1628;text-transform:uppercase;">You're In!</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#444;">
        Hi <strong>${captainName}</strong>, great news — your team has been approved!
      </p>
      ${goldDivider()}
      <div style="background:#f0fff4;border-left:4px solid #22c55e;padding:14px 16px;margin-bottom:20px;">
        <p style="margin:0;font-size:15px;color:#0A1628;">
          <strong style="color:#16a34a;">Approved:</strong> <strong>${teamName}</strong> is officially registered for the All Star Champions tournament. Get your squad ready!
        </p>
      </div>
      <p style="font-size:13px;color:#666;">
        Stay tuned for updates on match schedules and group draws. Follow us on Instagram <strong>@all_star_champions</strong> for the latest news.
      </p>
    `
    : `
      <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0A1628;text-transform:uppercase;">Registration Update</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#444;">
        Hi <strong>${captainName}</strong>, we have an update regarding your team's registration.
      </p>
      ${goldDivider()}
      <div style="background:#fff5f5;border-left:4px solid #ef4444;padding:14px 16px;margin-bottom:20px;">
        <p style="margin:0;font-size:15px;color:#0A1628;">
          <strong style="color:#dc2626;">Not Approved:</strong> Unfortunately, <strong>${teamName}</strong> was not approved for this tournament.
        </p>
        ${
          reason
            ? `<p style="margin:10px 0 0;font-size:14px;color:#555;"><strong>Reason:</strong> ${reason}</p>`
            : ""
        }
      </div>
      <p style="font-size:13px;color:#666;">
        We appreciate your interest. If you have questions, please contact us at <strong>929-304-3899</strong> or DM <strong>@all_star_champions</strong> on Instagram.
      </p>
    `;

  const subject = isApproved
    ? `Approved! ${teamName} is in the tournament | All Star Champions`
    : `Registration Update for ${teamName} | All Star Champions`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: captainEmail,
      subject,
      html: emailWrapper(body),
    });
    if (error) {
      console.error("[email] Resend error (status notification):", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] Failed to send status notification:", err);
    return { ok: false, error: String(err) };
  }
}

// ─── 3. Contact Form Confirmation ─────────────────────────────────────────────

export async function sendContactConfirmation(
  senderEmail: string,
  senderName: string,
  message: string,
): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.log("[email] Skipping contact confirmation — no API key.");
    return { ok: false, error: "Email not configured" };
  }

  const body = `
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0A1628;text-transform:uppercase;">Message Received</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#444;">
      Hi <strong>${senderName}</strong>, thanks for reaching out! We've received your message and will get back to you soon.
    </p>
    ${goldDivider()}
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0A1628;text-transform:uppercase;letter-spacing:0.05em;">Your Message</p>
    <div style="background:#f9f9f9;border:1px solid #e0e0e0;padding:14px 16px;font-size:14px;color:#333;line-height:1.6;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    ${goldDivider()}
    <p style="font-size:13px;color:#666;">
      In the meantime, you can also reach us at <strong>929-304-3899</strong> or on Instagram <strong>@all_star_champions</strong>.
    </p>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: senderEmail,
      subject: `We received your message | All Star Champions`,
      html: emailWrapper(body),
    });
    if (error) {
      console.error("[email] Resend error (contact confirmation):", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] Failed to send contact confirmation:", err);
    return { ok: false, error: String(err) };
  }
}

// ─── Legacy export kept for backward compatibility ────────────────────────────

/** @deprecated Use sendContactConfirmation instead */
export async function sendContactEmail(
  name: string,
  message: string,
): Promise<{ ok: boolean; error?: string }> {
  console.log("[email] sendContactEmail called without sender email — skipping confirmation.");
  return { ok: false, error: "No sender email provided" };
}
