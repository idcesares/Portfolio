import { Code, Snippet } from "@heroui/react";
import { Children, isValidElement } from "react";
import type { HTMLAttributes, ReactElement } from "react";

const joinClassNames = (
  ...values: Array<string | undefined | null | false>
): string => values.filter(Boolean).join(" ");

type InlineCodeProps = HTMLAttributes<HTMLElement>;
type CodeBlockProps = HTMLAttributes<HTMLDivElement>;

export function HeroInlineCode({ children, className, ...rest }: InlineCodeProps) {
  const language =
    typeof className === "string"
      ? className
          .split(" ")
          .find((token) => token.startsWith("language-"))
          ?.replace("language-", "")
      : undefined;

  return (
    <Code
      as="code"
      {...rest}
      data-language={language}
      className={joinClassNames("hero-inline-code", className)}
      radius="sm"
      size="sm"
    >
      {children}
    </Code>
  );
}

export function HeroCodeBlock({ children, className, ...rest }: CodeBlockProps) {
  const childArray = Children.toArray(children);
  const codeChild = childArray.find((child): child is ReactElement => isValidElement(child));
  const codeProps = codeChild?.props ?? {};

  const language =
    typeof codeProps["data-language"] === "string" && codeProps["data-language"].length > 0
      ? codeProps["data-language"]
      : typeof codeProps.className === "string"
        ? codeProps.className
            .split(" ")
            .find((token: string) => token.startsWith("language-"))
            ?.replace("language-", "")
        : undefined;

  const codeSegments = Children.toArray(codeProps.children ?? childArray);
  const codeText = codeSegments
    .map((segment) => (typeof segment === "string" ? segment : ""))
    .join("")
    .replace(/\n$/, "");

  const hasCode = codeText.trim().length > 0;
  const lines = hasCode ? codeText.split("\n") : [];

  return (
    <Snippet
      {...rest}
      data-language={language}
      hideSymbol
      disableCopy={!hasCode}
      hideCopyButton={!hasCode}
      classNames={{
        base: joinClassNames("hero-code-block", className),
        pre: "hero-code-block__pre",
        content: "hero-code-block__content",
      }}
      codeString={hasCode ? codeText : undefined}
      tooltipProps={{ content: "Copiar", delay: 600, placement: "top" }}
      translate="no"
      radius="md"
      size="md"
      variant="flat"
    >
      {hasCode ? lines : codeProps.children ?? childArray}
    </Snippet>
  );
}
