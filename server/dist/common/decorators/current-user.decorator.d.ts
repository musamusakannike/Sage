export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    orgId: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
