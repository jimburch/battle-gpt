import React, { useRef, useState } from "react";
import { Box, Flex, Button, Icon, Image } from "@chakra-ui/react";
import { FormValues } from "@/app/page";
import { FormikProps } from "formik";
import { GiBattleGear, GiBattleMech } from "react-icons/gi";

type FileInputProps = {
  name: keyof FormValues;
  isLoading: boolean;
  handleChange: FormikProps<FormValues>["handleChange"];
  setFieldValue: FormikProps<FormValues>["setFieldValue"];
  values: FormValues;
};

const FileInput = ({ name, isLoading, setFieldValue }: FileInputProps) => {
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
      <Flex
        background="gray.100"
        justifyContent="center"
        alignItems="center"
        height={400}
        width={300}
        borderRadius={5}
        marginBottom={4}
        overflow="hidden"
      >
        {selectedImage ? (
          <Image
            src={selectedImage || ""}
            alt="Player One"
            height={400}
            width={300}
            objectFit="cover"
          />
        ) : (
          <Icon
            as={name === "playerOneImage" ? GiBattleGear : GiBattleMech}
            boxSize={200}
          />
        )}
      </Flex>
      <Button width="full" onClick={handleInputClick} isDisabled={isLoading}>
        Upload Photo
      </Button>
    </Box>
  );
};

export default FileInput;
