import { User, Session } from 'next-auth';
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
}

interface SessionExt extends Session {
  accessToken?: string;
  address?: string;
  needsRegistration?: boolean;
}

interface JwtExt extends JWT {
  user?: UserExt;
}

// admin
interface IBodyInput {
  nim: string;
  major: string;
  dateTest: Date;
  sessionTest: number;
  listening: number;
  reading: number;
  writing: number;
}


export { ILogin, IRegister, UserExt, SessionExt, JwtExt, IBodyInput };
