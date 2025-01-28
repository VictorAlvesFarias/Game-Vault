import IClaimsKeys from "./claims";

export interface AuthContextType {
    isAuthenticated?: boolean;
    signIn: (data) => Promise<any>;
    logout: () => void;
    permissions?: IClaimsKeys | null
}
