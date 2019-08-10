export interface User {
    uid: string;
    email?: string;
    milestones?: number[];
    refreshToken: string;
    photoURL?: string;
    displayName?: string;
    uploadPlaylistId?: string;
}