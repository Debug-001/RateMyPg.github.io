'use client';

import { useRouter } from 'next/navigation';
import { auth } from "../context/Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "../context/AuthContext";  // Import useAuth

export const Login = () => {
    const { user } = useAuth();  // Check global auth state
    const router = useRouter();

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                router.replace('/profile'); 
            }
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    };

    if (user) {
        router.replace('/profile');  // If logged in, go to profile
        return null;
    }

    return (
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Sign in</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <button className="btn btn-primary" onClick={googleLogin}>
                            Login with Google
                        </button>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
