import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    interface RequestWithUser extends Request {
      user?: { companyId?: string };
    }
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    // Assuming Firebase decoded token is attached to request.user
    // and companyId is set as a custom claim
    return request.user?.companyId;
  },
);
