"use client";

import { useState } from "react";
import {
  Box,
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
  Image,
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

export interface ParsedData {
  winner: number;
  length_of_fight: string;
  finishing_move: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<ParsedData | null>();

  const formik = useFormik<FormValues>({
    initialValues: {
      playerOneImage: "",
      playerOneName: "",
      playerTwoImage: "",
      playerTwoName: "",
    },
    validationSchema: Yup.object({
      playerOneName: Yup.string()
        .required("Name is Required")
        .max(30, "Name is too long"),
      playerTwoName: Yup.string()
        .required("Name is Required")
        .max(30, "Name is too long"),
      playerOneImage: Yup.string().required("Player Image is Required"),
      playerTwoImage: Yup.string().required("Player Image is Required"),
    }),
    onSubmit: async (values) => {
      await handleClick(values);
    },
  });

  async function handleClick(values: FormValues) {
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();

    formData.append("playerOneName", values.playerOneName);
    formData.append("playerTwoName", values.playerTwoName);
    formData.append("playerOneImage", values.playerOneImage);
    formData.append("playerTwoImage", values.playerTwoImage);

    const response = await fetch("/api", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const parsedData = JSON.parse(data);

    if (!response.ok || !parsedData) {
      console.error("Error:", response.statusText);
      setIsLoading(false);
    }

    setIsLoading(false);
    setMessage(parsedData);
  }

  return (
    <main>
      <Flex flexDirection="column" align="center">
        <Box marginY={4}>
          <Image src="/logo.png" alt="Logo" width={500} />
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Flex alignItems="center" gap={4}>
            <VStack>
              <FormControl
                isInvalid={
                  !!formik.errors.playerOneImage &&
                  formik.touched.playerOneImage
                }
              >
                <FileInput
                  name="playerOneImage"
                  isLoading={isLoading}
                  {...formik}
                />
                <FormErrorMessage>
                  {formik.errors.playerOneImage}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={
                  !!formik.errors.playerOneName && formik.touched.playerOneName
                }
                isDisabled={isLoading}
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

            <Image src="/versus.png" alt="VS" width={100} height={100} />

            <VStack>
              <FormControl
                isInvalid={
                  !!formik.errors.playerTwoImage &&
                  formik.touched.playerTwoImage
                }
              >
                <FileInput
                  name="playerTwoImage"
                  isLoading={isLoading}
                  {...formik}
                />
                <FormErrorMessage>
                  {formik.errors.playerTwoImage}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  !!formik.errors.playerTwoName && formik.touched.playerTwoName
                }
                isDisabled={isLoading}
              >
                <FormLabel htmlFor="playerTwoName">Player Two Name</FormLabel>
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

          <Flex width="full" justifyContent="center" paddingTop={8}>
            <Button
              type="submit"
              width={200}
              background="linear-gradient(to bottom right, yellow, red 40%, black)"
              color="white"
              _hover={{ opacity: 0.8 }}
              _active={{ opacity: 0.6 }}
              isLoading={isLoading}
              loadingText="Fighting..."
            >
              Fight!
            </Button>
          </Flex>
        </form>
        {message && !isLoading && (
          <Box>
            <Text>{message.winner}</Text>
            <Text>{message.length_of_fight}</Text>
            <Text>{message.finishing_move}</Text>
          </Box>
        )}
      </Flex>
    </main>
  );
}
