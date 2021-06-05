import { User } from 'firebase';
import { FC, createContext, useEffect, useState } from 'react';

import firebase from '../../constants/firebase';

const AuthContext = createContext({} as{
  currentUser: User | null | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>
});

const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
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