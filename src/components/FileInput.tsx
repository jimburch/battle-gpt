import React, { useRef, useState } from "react";
import Image from "next/image";
import { Box, Button } from "@chakra-ui/react";
import { FormValues } from "@/app/page";
import { FormikProps } from "formik";

type FileInputProps = {
  name: keyof FormValues;
  handleChange: FormikProps<FormValues>["handleChange"];
  setFieldValue: FormikProps<FormValues>["setFieldValue"];
  values: FormValues;
};

const FileInput = ({
  name,
  handleChange,
  values,
  setFieldValue,
}: FileInputProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleInputChange = (e: any) => {
    const file = e.target.files[0];
    setFieldValue(name, file);
    setSelectedImage(URL.createObjectURL(file));
  };

  return (
    <Box>
      <input
        id={name}
        name={name}
        type="file"
        ref={inputRef}
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      <Image
        src={selectedImage || ""}
        alt="Player One"
        width={200}
        height={300}
      />
      <Button onClick={handleInputClick}>Choose Photo</Button>
    </Box>
  );
};

export default FileInput;
