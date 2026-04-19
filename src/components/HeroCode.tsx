import { Children, isValidElement } from "react";
import type { ReactElement } from "react";

const joinClassNames = (
  ...values: Array<string | undefined | null | false>
): string => values.filter(Boolean).join(" ");

type InlineCodeProps = {
  children?: React.ReactNode;
  className?: string;
};
type CodeBlockProps = {
  children?: React.ReactNode;
  className?: string;
};

export function HeroInlineCode({ children, className }: InlineCodeProps) {
  const language =
    typeof className === "string"
      ? className
          .split(" ")
          .find((token) => token.startsWith("language-"))
          ?.replace("language-", "")
      : undefined;

  return (
    <code
      data-language={language}
      className={joinClassNames("hero-inline-code", className)}
    >
      {children}
    </code>
  );
}

interface CodeElementProps {
  children?: React.ReactNode;
  className?: string;
  'data-language'?: string;
  [key: string]: any;
}

export function HeroCodeBlock({ children, className }: CodeBlockProps) {
  const childArray = Children.toArray(children);
  const codeChild = childArray.find((child): child is ReactElement => isValidElement(child));
  const codeProps = (codeChild?.props ?? {}) as CodeElementProps;

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
  return (
    <pre
      data-language={language}
      className={joinClassNames("hero-code-block", className)}
      translate="no"
    >
      <code className="hero-code-block__content">
        {hasCode ? codeText : codeProps.children ?? childArray}
      </code>
    </pre>
  );
}
