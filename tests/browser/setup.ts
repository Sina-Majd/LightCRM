import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@/app/globals.css";

document.documentElement.lang = "fa";
document.documentElement.dir = "rtl";
document.documentElement.style.setProperty("--font-fa", '"Segoe UI", sans-serif');
afterEach(cleanup);
