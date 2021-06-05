import firebase from 'firebase';
import { FC, createContext, useEffect, useState } from 'react';

import firebaseInstance from '../../constants/firebase';

const AuthContext = createContext({} as{
  currentUser: firebaseInstance.User | null | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<firebaseInstance.User | null | undefined>>
});

const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null | undefined>(
    undefined
  );

  useEffect(() => {
    // ログイン状態が変化するとfirebaseのauthメソッドを呼び出す
    firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log(user?.uid)
      console.log(user?.displayName)
    })
  }, []);

  /* 下階層のコンポーネントをラップする */
  return (
    <AuthContext.Provider value={{ currentUser: currentUser,  setCurrentUser:  setCurrentUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }