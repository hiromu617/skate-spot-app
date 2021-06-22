
import firebase from "firebase";

export const getImagePromise = (path: string) => {
  return new Promise((resolve) => {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var spaceRef = storageRef.child(path);
    spaceRef
      .getDownloadURL()
      .then(function (url: string) {
        console.log("ファイルURLを取得");
        console.log(url);
        resolve(url);
      })
      .catch(function (error) {
        // Handle any errors
        console.log(error);
      });
  });
};