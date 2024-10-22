'use client';

import { auth } from '../../context/Firebase';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      setUserDetails(user);
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      router.replace('/');
      console.log('logout success');
    } catch (error) {
      console.log('error logout', error.message);
    }
  }

  return (
    <div>
      {userDetails ? (
        <div>
          <h3>{userDetails.displayName}</h3>
          <h3>{userDetails.email}</h3>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p>Loading....</p>
      )}
    </div>
  );
};

export default Profile; 
