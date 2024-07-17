"use client";

import { useState } from "react";
import {
  Button,
  Box,
  Text,
  Input,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileInput from "@/components/FileInput";

export interface FormValues {
  playerOneImage: string;
  playerOneName: string;
  playerTwoImage: string;
  playerTwoName: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formik = useFormik<FormValues>({
    initialValues: {
      playerOneImage: "",
      playerOneName: "",
      playerTwoImage: "",
      playerTwoName: "",
    },
    validationSchema: Yup.object({
      playerOneName: Yup.string().required("Required").max(10, "Too long"),
      playerTwoName: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  async function handleClick() {
    setIsLoading(true);
    setMessage("");
    const response = await fetch("/api", {
      method: "POST",
    });
    const data = await response.json();
    setIsLoading(false);
    setMessage(data);
  }

  return (
    <main>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Heading>Battle GPT</Heading>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FileInput name="playerOneName" {...formik} />
            <FormHelperText>Upload an image for Player One</FormHelperText>
            <FormErrorMessage>{formik.errors.playerOneImage}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={
              !!formik.errors.playerOneName && formik.touched.playerOneName
            }
          >
            <FormLabel htmlFor="playerOneName">Player One Name</FormLabel>
            <Input
              id="playerOneName"
              name="playerOneName"
              placeholder="Player One..."
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.playerOneName}
            />
            <FormErrorMessage>{formik.errors.playerOneName}</FormErrorMessage>
          </FormControl>

          {/* <FileInput /> */}

          <FormControl
            isInvalid={
              !!formik.errors.playerTwoName && formik.touched.playerTwoName
            }
          >
            <FormLabel htmlFor="playerTwoName">Player One Name</FormLabel>
            <Input
              id="playerTwoName"
              name="playerTwoName"
              placeholder="Player Two..."
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.playerTwoName}
            />
            <FormErrorMessage>{formik.errors.playerTwoName}</FormErrorMessage>
          </FormControl>

          <Button type="submit">Submit</Button>
        </form>
        {isLoading && <Text>Loading...</Text>}
        {message && <Text>{message}</Text>}
      </Box>
    </main>
  );
}
