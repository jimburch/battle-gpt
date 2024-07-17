"use client";

import { useState } from "react";
import { Button, Text } from "@chakra-ui/react";
import FileInput from "@/components/FileInput";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      <h1>Battle GPT</h1>
      <FileInput />
      <FileInput />
      <Button onClick={handleClick}>Click me</Button>
      {isLoading && <Text>Loading...</Text>}
      {message && <Text>{message}</Text>}
    </main>
  );
}
