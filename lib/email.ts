import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendContactEmail(name: string, message: string) {
  const to = process.env.CONTACT_EMAIL || "9293043899@txt.att.net";
  
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER || "allstarchampions@example.com",
      to,
      subject: `New Contact Message from ${name}`,
      text: `From: ${name}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { ok: false, error: String(error) };
  }
}
