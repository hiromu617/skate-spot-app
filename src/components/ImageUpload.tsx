import {
  FormControl,
  FormLabel,
  FormHelperText,
  Image,
} from "@chakra-ui/react";
import { Heading, Box, Text, Flex, Spacer } from "@chakra-ui/layout";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  setMyFiles: React.Dispatch<React.SetStateAction<File[]>>;
  myFiles: File[];
};

const ImageUpload: React.FC<Props> = ({ setMyFiles, myFiles, children }) => {
  const [src, setSrc] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles[0]) return;

    try {
      setMyFiles([...acceptedFiles]);
      handlePreview(acceptedFiles);
    } catch (error) {
      alert(error);
    }
  }, []);

  const onDropRejected = () => {
    alert("画像のみ受け付けることができます。");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
  });

  // プレビューを表示
  const handlePreview = (files: any) => {
    if (files === null) {
      return;
    }
    const file = files[0];
    if (file === null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSrc(reader.result as string);
    };
  };

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {myFiles.length === 0 ? (
        <div>{children}</div>
      ) : (
        <div>
          {src && (
            <Image boxSize="300px" src={src} alt="スポットの画像のプレビュー" />
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
