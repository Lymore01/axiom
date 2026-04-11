import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Axeom",
  description: "The weightless framework for heavy performance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
