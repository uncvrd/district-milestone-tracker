export interface User {
    displayName: string;
    email: string;
    milestones: number[];
    photoURL: string;
    refreshToken: string;
    uid: string;
    uploadPlaylistId: string;
    approved: boolean;
}