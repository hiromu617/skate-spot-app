import firebase from "../../constants/firebase";

export const handleUpload = async (path: string, files: File[]) => {
  const storage = firebase.storage();
  try {
    // アップロード処理
    const uploadTask: any = storage.ref(path).put(files[0]);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, next, error);
  } catch (error) {
    console.log("エラーキャッチ", error);
  }
};

const next = (snapshot: { bytesTransferred: number; totalBytes: number }) => {
  // 進行中のsnapshotを得る
  // アップロードの進行度を表示
  const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log(percent + "% done");
  console.log(snapshot);
};

const error = (error: any) => {
  alert(error);
};
