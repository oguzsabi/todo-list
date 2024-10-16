import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const ApiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const apiReq = req.clone({ url: `/api/${req.url}` });

  return next(apiReq);
};
