import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';

export const emailResetTemplate = (
    appName: string,
    user: UserDoc,
    token: string
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
<html lang="en">
  <head></head>
  <body
    style="
      margin-left: auto;
      margin-right: auto;
      margin-top: auto;
      margin-bottom: auto;
      background-color: rgb(255, 255, 255);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
        Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    "
  >
    <table
      align="center"
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="
        max-width: 37.5em;
        margin-left: auto;
        margin-right: auto;
        margin-top: 40px;
        margin-bottom: 40px;
        width: 465px;
        border-radius: 0.25rem;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(234, 234, 234);
        padding: 20px;
      "
    >
      <tr style="width: 100%">
        <td>
          <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            width="100%"
            style="margin-top: 32px"
          >
            <tbody>
              <tr>
                <td>
                  <img
                    alt="Vercel"
                    src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-logo.png"
                    width="40"
                    height="37"
                    style="
                      display: block;
                      outline: none;
                      border: none;
                      text-decoration: none;
                      margin-left: auto;
                      margin-right: auto;
                      margin-top: 0px;
                      margin-bottom: 0px;
                    "
                  />
                  <p
                    style="
                      font-size: 14px;
                      font-weight: bold;
                      text-align: center;
                      line-height: 24px;
                      margin: 16px 0;
                      color: rgb(0, 0, 0);
                    "
                  >
                    VERIFY YOUR IDENTIFY
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <p style="font-size: 14px; line-height: 24px; margin: 14px 0; color: rgb(0, 0, 0)">
            Hello <strong>${user.fullName}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 24px; margin: 14px 0; color: rgb(0, 0, 0)">
            A request has been received to change the password for your Quizlearn account.
          </p>

          <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            width="100%"
            style="margin-bottom: 32px; margin-top: 32px; text-align: center"
          >
            <tbody>
              <tr>
                <td>
                  <p
                    style="
                      p-x: 20px;
                      p-y: 12px;
                      line-height: 100%;
                      text-decoration: none;
                      padding: 16px;
                      border-radius: 0.25rem;
                      color: rgb(0, 0, 0);
                      text-align: center;
                      font-size: 36px;
                      font-weight: bold;
                      background-color: rgb(229, 229, 229);
                      text-decoration-line: none;
                      letter-spacing: 0.1em;
                    "
                  >
                    ${token}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          <p style="font-size: 14px; line-height: 24px; margin: 14px 0; color: rgb(0, 0, 0)">
            If you did not initiate this request, please contact us immediately at
          </p>
          <p style="font-size: 14px; line-height: 24px; margin: 14px 0; color: rgb(0, 0, 0)">
            Thanks,<br />
            The ${appName} Team
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
