"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Heading,
  FormControl,
  FormErrorMessage,
  Flex,
  VStack,
  Image,
  HStack,
  Center,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileInput from "@/components/FileInput";
import { PostResponse } from "./api/route";
import Winner from "@/components/Winner";
import supabase from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { GiPunchBlast } from "react-icons/gi";

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
  const [message, setMessage] = useState<PostResponse | null>();
  const [status, setStatus] = useState("");
  const [channelIdState, setChannelIdState] = useState("");

  useEffect(() => {
    const channelId = uuidv4();
    setChannelIdState(channelId);
    const channel = supabase
      .channel(channelId)
      .on(
        "broadcast",
        {
          event: "test",
        },
        (payload) => {
          switch (payload.payload.message) {
            case "images_uploaded":
              setStatus("Punches punching, kicks kicking...");
              break;
            case "fight_json_generated":
              setStatus("The final round...");
              setTimeout(() => {
                setStatus("Crowning a champion...");
              }, 6000);
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      setStatus("");
    };
  }, []);

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
    setStatus("Sizing up the competition...");

    const formData = new FormData();

    formData.append("channelId", channelIdState);
    formData.append("playerOneName", values.playerOneName);
    formData.append("playerTwoName", values.playerTwoName);
    formData.append("playerOneImage", values.playerOneImage);
    formData.append("playerTwoImage", values.playerTwoImage);

    const response = await fetch("/api", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data) {
      setIsLoading(false);
      setMessage(null);
      setStatus("");
      throw new Error(response.statusText);
    }

    setIsLoading(false);
    setMessage({
      ...data,
      textResponse: {
        ...data.textResponse,
        winner:
          data.textResponse.winner === 1
            ? values.playerOneName
            : values.playerTwoName,
      },
    });
  }

  const handleReset = () => {
    formik.resetForm();
    setMessage(null);
    setStatus("");
  };

  return (
    <main>
      <Flex direction="column" width="full" align="center" paddingY={6}>
        <Flex
          paddingBottom={4}
          direction="column"
          align="center"
          textAlign="center"
          paddingX={10}
        >
          <Image src="/logo.png" alt="Logo" width={{ base: 350, md: 500 }} />
          <Text>
            Head-to-head combat, judged by OpenAI. Upload photos to see who
            would win in a fight.
          </Text>
        </Flex>
        {message ? (
          <Flex direction="column" align="center" gap={10}>
            <Winner
              name={message.textResponse.winner}
              imageUrl={message.imageResponse.url}
              lengthOfFight={message.textResponse.length_of_fight}
              finishingMove={message.textResponse.finishing_move}
            />
            <HStack>
              <Button
                leftIcon={<GiPunchBlast />}
                size="lg"
                onClick={handleReset}
              >
                New Fight
              </Button>
            </HStack>
          </Flex>
        ) : (
          <Flex
            flexDirection="column"
            align="center"
            justify="center"
            position="relative"
          >
            {status && (
              <Center
                position="absolute"
                top={40}
                zIndex={1}
                background="white"
                paddingRight={5}
                borderRadius={5}
                overflow="hidden"
                boxShadow="lg"
              >
                <Image src="/wrestling.gif" alt="Wrestling" width={100} />
                <Heading size="md">{status}</Heading>
              </Center>
            )}
            <form onSubmit={formik.handleSubmit}>
              <Flex
                alignItems="center"
                gap={4}
                opacity={isLoading ? 0.1 : 1}
                position="relative"
                direction={{ base: "column", md: "row" }}
                height={{ base: status ? 415 : "100%", md: "100%" }}
                overflow={status ? "hidden" : "visible"}
              >
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
                      !!formik.errors.playerOneName &&
                      formik.touched.playerOneName
                    }
                    isDisabled={isLoading}
                  >
                    <Input
                      id="playerOneName"
                      name="playerOneName"
                      placeholder="Player One Name..."
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

                <Image
                  src="/versus.png"
                  alt="VS"
                  width={{ base: 75, md: 100 }}
                />

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
                      !!formik.errors.playerTwoName &&
                      formik.touched.playerTwoName
                    }
                    isDisabled={isLoading}
                  >
                    <Input
                      id="playerTwoName"
                      name="playerTwoName"
                      placeholder="Player Two Name..."
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
                  size="lg"
                  width={{ base: 350, md: 200 }}
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
          </Flex>
        )}
      </Flex>
    </main>
  );
}
