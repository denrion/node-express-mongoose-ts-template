/* eslint-disable no-console */
import colors from 'colors';
import { createTestAccount, createTransport, getTestMessageUrl } from 'nodemailer';
import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USERNAME } from '../../constants/ENV';
import { IUserDocument } from '../../models/User/user.types';

const sendEmail = async (user: IUserDocument, subject: string, text: string, html: string = '') => {
  const isProduction = process.env.NODE_ENV === 'production';

  const testAccount = await createTestAccount();

  const transporter = createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: isProduction,
    auth: {
      user: EMAIL_USERNAME || testAccount.user,
      pass: EMAIL_PASSWORD || testAccount.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify((error) =>
    error
      ? console.error(colors.red('Error: '), error)
      : console.log(colors.yellow('Server is ready to take our messages'))
  );

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'test-template@test.com',
    to: user.email,
    subject,
    html,
    text,
  });

  console.log(colors.yellow('Message sent: %s'), info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  if (!isProduction) {
    // // Preview only available when sending through an Ethereal account
    console.log(colors.cyan('Preview URL: %s'), getTestMessageUrl(info));
  }
};

export const sendWelcomeEmail = async (
  user: IUserDocument,
  subject: string = 'Welcome to Our Family'
) => {
  const text = `Hi ${user.email}, 
  Welcome to our family, we're glad to have you 🎉🙏`;
  await sendEmail(user, subject, text);
};

export const sendPasswordResetEmail = async (
  user: IUserDocument,
  url: string,
  subject: string = 'Your password reset token (valid for only 10 minutes)'
) => {
  const text = `Hi ${user.email}
  Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${url}`;
  await sendEmail(user, subject, text);
};
