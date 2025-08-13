import { AuthGuard } from '@nestjs/passport';
//just pass the name of the strategy to the AuthGuard superclass
export class LocalAuthGuard extends AuthGuard('local') {}
