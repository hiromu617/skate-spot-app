import { FC, createContext, useEffect, useState, SetStateAction } from "react";

const ImageCacheContext = createContext(
  {} as {
    imageCache: HashMap;
    setImageCache: React.Dispatch<SetStateAction<any>>;
  }
);

interface HashMap {
  // (文字型のキー):  string
  [index: string]: string
}

const ImageCacheProvider: FC = ({ children }) => {
  const [imageCache, setImageCache] = useState<HashMap>({});

  /* 下階層のコンポーネントをラップする */
  return (
    <ImageCacheContext.Provider
      value={{ imageCache: imageCache, setImageCache: setImageCache }}
    >
      {children}
    </ImageCacheContext.Provider>
  );
};

export { ImageCacheContext, ImageCacheProvider };
