"use client";

import { FC, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";

const Providers: FC<any> = ({ children }) => {
  // if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  return (
    <NextUIProvider>{children}</NextUIProvider>
  );
  // }
};

export default Providers;
