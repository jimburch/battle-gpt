import React, { useRef, useState } from "react";
import Image from "next/image";
import { Box, Button } from "@chakra-ui/react";
import { FormValues } from "@/app/page";
import { FormikProps } from "formik";

type FileInputProps = {
  name: keyof FormValues;
  handleChange: FormikProps<FormValues>["handleChange"];
  values: FormValues;
};

const FileInput = ({ name, handleChange, values }: FileInputProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleInputChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // Step 2: Update the Formik value with the base64 string
      const base64String = reader.result as string;
      setSelectedImage(base64String); // Step 3: Update the image preview
      handleChange({ target: { name, value: base64String } }); // Use Formik's handleChange
    };
    reader.readAsDataURL(file);
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
        // value={values[name]}
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
