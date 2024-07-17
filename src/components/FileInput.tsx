import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Input, Box } from "@chakra-ui/react";
import { FormValues } from "@/app/page";
import { FormikProps } from "formik";

type FileInputProps<T = FormValues> = {
  name: string;
} & FormikProps<T>;

const FileInput = <T extends FormValues>({
  name,
  setFieldValue,
}: FileInputProps<T>) => {
  return (
    <Box>
      <input type="file" accept="image/*" />
    </Box>
  );
};

export default FileInput;
