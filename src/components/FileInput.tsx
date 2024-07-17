import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Input } from "@chakra-ui/react";

const FileInput: React.FC = () => {
  return (
    <div>
      <input type="file" accept="image/*" />
    </div>
  );
};

export default FileInput;
