/**
 * Session Manager - Handles session state and prevents multiple logout loops
 */
class SessionManager {
    private isLoggingOut = false;
    private isSessionExpired = false;

    get isCurrentlyLoggingOut(): boolean {
        return this.isLoggingOut;
    }

    get isExpired(): boolean {
        return this.isSessionExpired;
    }

    markSessionExpired(): void {
        this.isSessionExpired = true;
    }

    startLogout(): void {
        this.isLoggingOut = true;
        this.isSessionExpired = true;
    }

    reset(): void {
        this.isLoggingOut = false;
        this.isSessionExpired = false;
    }

    shouldPreventAPICall(): boolean {
        return this.isLoggingOut || this.isSessionExpired;
    }
}

export const sessionManager = new SessionManager();
