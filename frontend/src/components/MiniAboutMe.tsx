import React, { useEffect } from 'react';
import { useAuth } from './auth/Auth';

const MiniAboutMe = () => {
    /**
     * This is a component that demonstrates the usage of auth.fetch
     * It can be used just like fetch! and automatically handles authentication
     * It uses the stored token to query /users/me to get information about the user
     * In this case it is just the username.
     */
    const auth = useAuth();
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (auth.user != null) {
                return;
            }
            // TODO: why is this request firing twice?
            const r = await auth.fetch("/auth/users/me/", {});
            if (r.ok) {
                const userInfo = await r.json();
                auth.setUser(userInfo);
            }
        }
        fetchUserInfo();
    });
    return (
        <span className="text-sm text-gray-900">
            {auth.user?.username ?? ""}
        </span>);
}
export default MiniAboutMe;