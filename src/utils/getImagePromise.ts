import firebase from "firebase";

export const getImagePromise = (path: string) => {
  return new Promise((resolve) => {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var spaceRef = storageRef.child(path);
    var newMetadata = {
      cacheControl: "public,max-age=4000",
      contentType: "image/jpeg",
    };

    // Update metadata properties
    spaceRef
      .updateMetadata(newMetadata)
      .then(function (metadata) {
        // Updated metadata for 'images/forest.jpg' is returned in the Promise
        console.log("update metaData")
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
        console.log("error occured on updating metaData")
      });
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
