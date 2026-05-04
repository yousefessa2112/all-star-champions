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

export async function sendRegistrationConfirmation(email: string, teamName: string) {
  try {
    await transporter.sendMail({
      from: `"All Star Champions" <${process.env.SMTP_USER || "allstarchampions@example.com"}>`,
      to: email,
      subject: "Team Registration Received - All Star Champions",
      text: `Thank you for registering your team "${teamName}" for the All Star Champions tournament!\n\nYour registration has been received and is pending admin approval. You will be notified once your team has been reviewed.\n\nIf you have any questions, please contact us at 929-304-3899 or @all_star_champions on Instagram.\n\nBest regards,\nAll Star Champions Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700;">Thank You for Registering!</h2>
          <p>Your team <strong>"${teamName}"</strong> has been registered for the All Star Champions tournament.</p>
          <p>Your registration is currently <strong>pending admin approval</strong>. You will be notified once your team has been reviewed.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px;">
            If you have any questions, please contact us:<br/>
            <strong>Phone:</strong> 929-304-3899<br/>
            <strong>Instagram:</strong> @all_star_champions
          </p>
          <p style="color: #666; font-size: 14px;">Best regards,<br/>All Star Champions Team</p>
        </div>
      `,
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return { ok: false, error: String(error) };
  }
}
