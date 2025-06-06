import React, { useState, useEffect } from 'react';
import { auth, provider, signInWithPopup, signOut } from './firebase';

const Login = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => setUser(null));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <>
          {/* <div>Welcome, {user.displayName}</div> */}
          <img onClick={handleLogout} height={"40px"} src={user.photoURL} alt="profile" style={{ borderRadius: '50%' }} />
        </>
      ) : (
        <>
          <div onClick={handleLogin} style={{color : "white"}}>Signin</div>
        </>
      )}
    </div>
  );
};

export default Login;
