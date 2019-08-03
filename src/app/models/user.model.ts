export interface User {
    uid: string;
    email: string;
    refreshToken: string;
    photoURL?: string;
    displayName?: string;
    myCustomData?: string;
}