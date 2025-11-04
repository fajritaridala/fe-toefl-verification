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
  needsRegistration?: boolean;
}

interface SessionExt extends Session {
  user?: {
    address: string;
    fullName: string;
    email: string;
    role: string;
    accessToken?: string;
  };
}

interface JwtExt extends JWT {
  user?: UserExt;
}

export { ILogin, IRegister, UserExt, SessionExt, JwtExt };
