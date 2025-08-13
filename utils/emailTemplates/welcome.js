module.exports = function welcomeTemplate({ name, dashboardUrl }) {
  const safeName = name?.split(" ")[0] || "there";
  const url = dashboardUrl || "http://localhost:3000";

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Welcome to Technician Booking</title>
      </head>
      <body style="font-family:Arial,Helvetica,sans-serif; background:#f6f9fc; padding:24px; color:#222;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 8px; background:#0b5ed7; color:#fff;">
              <h1 style="margin:0; font-size:22px;">Welcome, ${safeName}! 🎉</h1>
              <p style="margin:8px 0 0; opacity:.95;">Your account has been created successfully.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px;">Thanks for joining <strong>Technician Booking</strong>.</p>
              <p style="margin:0 0 16px;">You can now log in, manage bookings, and track job status in real time.</p>
              <p style="margin:0 0 24px;">Click the button below to get started:</p>
              <p>
                <a href="${url}" style="background:#0b5ed7;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;display:inline-block;">
                  Go to Dashboard
                </a>
              </p>
              <p style="margin:24px 0 0; font-size:12px; color:#555;">
                If you did not create this account, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px; background:#f0f3f7; font-size:12px; color:#444;">
              © ${new Date().getFullYear()} Technician Booking
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;
};
