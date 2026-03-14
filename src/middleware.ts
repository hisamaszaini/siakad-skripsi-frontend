import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = ['/login/mahasiswa', '/login/dosen', '/login/admin', '/api'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Get Authentication State
    const token = request.cookies.get('auth_token')?.value ||
        request.cookies.get('session_token')?.value ||
        request.cookies.get('token')?.value;

    const userDataStr = request.cookies.get('user_data')?.value;
    let userRole = '';

    if (userDataStr) {
        try {
            const userData = JSON.parse(decodeURIComponent(userDataStr));
            userRole = userData.role;
        } catch (e) {
            console.error('Failed to parse user_data cookie', e);
        }
    }

    // Helper for redirection based on role
    const getDashboardUrl = (role: string) => {
        if (!role) return null;
        const r = role.toLowerCase();
        if (r === 'mahasiswa') return '/student';
        if (r === 'dosen') return '/lecturer';
        if (r === 'admin_akademik' || r === 'super_admin' || r === 'admin_dev' || r === 'prodi') return '/admin';
        return null;
    };

    // Helper for login page based on path
    const getLoginPageUrl = (path: string) => {
        if (path.startsWith('/student')) return '/login/mahasiswa';
        if (path.startsWith('/lecturer')) return '/login/dosen';
        if (path.startsWith('/admin')) return '/login/admin';
        return '/'; // Default to landing page if root /login is hit or unknown
    };

    // 2. Allow Landing Page & Static Files
    if (
        pathname === '/' ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // 3. Handle Public Paths (Login, etc.)
    const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path + '/'));
    if (isPublicPath) {
        // If already logged in, don't let them hit /login pages again
        // We ONLY redirect if it's a specific login page, not /api or other public assets
        if (token && userRole && pathname.startsWith('/login')) {
            const target = getDashboardUrl(userRole);
            if (target && pathname !== target) {
                return NextResponse.redirect(new URL(target, request.url));
            }
        }
        return NextResponse.next();
    }

    // 4. Protect Private Paths
    if (!token) {
        // Redirect to specific login page based on the section
        const targetLogin = getLoginPageUrl(pathname);
        if (pathname === targetLogin) return NextResponse.next(); // Avoid loop if already at target login

        const loginUrl = new URL(targetLogin, request.url);
        // Only add 'from' if it's not the landing page
        if (targetLogin !== '/') {
            loginUrl.searchParams.set('from', pathname);
        }
        return NextResponse.redirect(loginUrl);
    }

    // Special case: /login (generic) is no longer used, redirect to dashboard if hit while authenticated
    if (pathname === '/login') {
        const target = getDashboardUrl(userRole) || '/';
        return NextResponse.redirect(new URL(target, request.url));
    }

    // 5. Role-Based Access Control (RBAC)
    if (!userRole) {
        // If there's a token but no role, we have an invalid session
        // Redirect to landing page to force fresh session
        if (pathname !== '/') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    const currentDashboardBase = getDashboardUrl(userRole);

    // If for some reason the role is unknown, fallback to landing page
    if (!currentDashboardBase) {
        if (pathname !== '/') return NextResponse.redirect(new URL('/', request.url));
        return NextResponse.next();
    }

    const r = userRole.toLowerCase();

    // Role-Specific Access Protection
    const studentPath = pathname.startsWith('/student');
    const lecturerPath = pathname.startsWith('/lecturer');
    const adminPath = pathname.startsWith('/admin');

    // - If it's a student path but user is NOT mahasiswa
    if (studentPath && r !== 'mahasiswa') {
        return NextResponse.redirect(new URL(currentDashboardBase, request.url));
    }

    // - If it's a lecturer path and user is NOT dosen (or admin)
    // Some admins might have lecturer access, but strictly checking by role here
    if (lecturerPath && !(r === 'dosen' || r === 'admin_akademik' || r === 'super_admin')) {
        return NextResponse.redirect(new URL(currentDashboardBase, request.url));
    }

    // - If it's an admin path and user is NOT an admin variant
    if (adminPath && !(r === 'admin_akademik' || r === 'super_admin' || r === 'admin_dev' || r === 'prodi')) {
        return NextResponse.redirect(new URL(currentDashboardBase, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
