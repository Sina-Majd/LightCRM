import { createElement, type ImgHTMLAttributes } from "react";

export default function Image({ src, alt, width, height, className, style }: ImgHTMLAttributes<HTMLImageElement>) {
  return createElement("img", { src, alt, width, height, className, style });
}
