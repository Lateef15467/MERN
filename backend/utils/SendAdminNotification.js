import { sendEmail } from "./SendEmail.js";

const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );

export const sendAdminNotification = async ({
  subject,
  title,
  message,
  details = [],
}) => {
  try {
    const adminEmail =
      process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error("Admin notification email is not configured.");
      return;
    }

    const detailRows = details
      .map(
        ({ label, value }) => `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #eee;color:#666;">
              ${escapeHtml(label)}
            </td>
            <td style="padding:10px;border-bottom:1px solid #eee;font-weight:600;">
              ${escapeHtml(value)}
            </td>
          </tr>
        `,
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333;">
        <div style="background:#111827;padding:22px;text-align:center;">
          <h2 style="color:white;margin:0;">BaltiMart Admin</h2>
        </div>

        <div style="padding:25px;">
          <h2 style="color:#111827;">${escapeHtml(title)}</h2>
          <p>${escapeHtml(message)}</p>

          <table style="width:100%;border-collapse:collapse;margin-top:20px;">
            ${detailRows}
          </table>

          <p style="margin-top:25px;color:#888;font-size:12px;">
            This is an automatic notification from your BaltiMart store.
          </p>
        </div>
      </div>
    `;

    await sendEmail(adminEmail, subject, html);

    console.log("Admin notification email sent:", adminEmail);
  } catch (error) {
    // Email failure must not interrupt registration or order placement.
    console.error("Admin notification email error:", error.message);
  }
};
