import { DefaultSession, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface ILogin {
  address: string;
}

interface IRegister extends ILogin {
  fullName: string;
  email: string;
  roleToken?: string;
}

interface UserExt extends User {
  accessToken?: string;
  role?: string;
  needsRegistration?: boolean;
}

interface SessionExt extends Session {
  fullName?: string;
  accessToken?: string;
  address?: string;
  needsRegistration?: boolean;
}

interface DefaultSessionExt extends DefaultSession {
  user?: {
    name?: string;
    email?: string;
    image?: string;
    address?: string;
  };
}

interface JwtExt extends JWT {
  user?: UserExt;
}

export { ILogin, IRegister, UserExt, SessionExt, JwtExt, DefaultSessionExt };
