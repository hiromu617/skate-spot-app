import firebase from 'firebase';
import { FC, createContext, useEffect, useState } from 'react';
import axios from '../../constants/axios'
import {User} from '../../types/user'

const AuthContext = createContext({} as{
  currentUser: User | null | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null | undefined>>
});

const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );

  useEffect(() => {
    // ログイン状態が変化するとfirebaseのauthメソッドを呼び出す
    firebase.auth().onAuthStateChanged(async (user) => {
      await axios.post('/api/users/', {
        user: {
          uid: user?.uid,
          name: user?.displayName
        }
      })
      .then(res => {
        console.log(res.data)
        setCurrentUser(res.data);
      })
      .catch(e => console.log(e))
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