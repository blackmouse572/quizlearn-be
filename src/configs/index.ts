import AppConfig from './app.config';
import AuthConfig from './auth.config';
import DatabaseConfig from './database.config';
import DocConfig from './doc.config';
import EmailConfig from './email.config';
import HelperConfig from './helper.config';
import SendgridConfig from './sendgrid.config';
export default [
    AppConfig,
    SendgridConfig,
    DocConfig,
    AuthConfig,
    EmailConfig,
    DatabaseConfig,
    HelperConfig,
];
