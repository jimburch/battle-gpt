"use client";

import { useState } from "react";
import {
  Button,
  Text,
  Input,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Flex,
  VStack,
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
      await handleClick(values);
    },
  });

  async function handleClick(values: FormValues) {
    setIsLoading(true);
    setMessage("");
    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await response.json();
    console.log(data);
    setIsLoading(false);
    // setMessage(data);
  }

  return (
    <main>
      <Flex flexDirection="column" alignItems="center">
        <Heading>Battle GPT</Heading>
        <Text>{"Fight to the death (but not for real)."}</Text>
        <form onSubmit={formik.handleSubmit}>
          <Flex>
            <VStack>
              <FormControl>
                <FileInput name="playerOneImage" {...formik} />
                <FormHelperText>Upload an image for Player One</FormHelperText>
                <FormErrorMessage>
                  {formik.errors.playerOneImage}
                </FormErrorMessage>
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
                <FormErrorMessage>
                  {formik.errors.playerOneName}
                </FormErrorMessage>
              </FormControl>
            </VStack>

            <VStack>
              <FormControl>
                <FileInput name="playerTwoImage" {...formik} />
                <FormHelperText>Upload an image for Player One</FormHelperText>
                <FormErrorMessage>
                  {formik.errors.playerTwoImage}
                </FormErrorMessage>
              </FormControl>

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
                <FormErrorMessage>
                  {formik.errors.playerTwoName}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </Flex>

          <Button type="submit">Submit</Button>
        </form>
        {isLoading && <Text>Loading...</Text>}
        {/* {message && <Text>{message}</Text>} */}
      </Flex>
    </main>
  );
}
