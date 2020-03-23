import { TooltipTrigger } from "@querycap-ui/blocks";
import { selector, themes } from "@querycap-ui/core";
import { Stack } from "@querycap-ui/layouts";
import React from "react";

const TooltipDemo = ({ placement }: { placement: string }) => {
  return (
    <TooltipTrigger placement={placement as any} content={<div css={{ padding: "0.2em" }}>{placement}</div>}>
      <div
        css={{
          border: `1px solid #ddd`,
          padding: "1em",
        }}>
        {placement}
      </div>
    </TooltipTrigger>
  );
};

export const Tooltips = () => (
  <Stack spacing={themes.space.s2} align={"center"} css={selector("& > *").width("50%")}>
    {[
      "left",
      "right",
      "bottom",
      "top",
      "left-top",
      "left-bottom",
      "right-top",
      "right-bottom",
      "top-left",
      "bottom-left",
      "top-right",
      "bottom-right",
    ].map((placement) => (
      <div key={placement}>
        <TooltipDemo placement={placement} />
      </div>
    ))}
  </Stack>
);
