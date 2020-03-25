import { colors, cover, rgba, selector, shadows, themes, ThemeState, withBackground } from "@querycap-ui/core";
import { Switch } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import { IRoute, NavLink, parseSearchString, Redirect, useRouter } from "@reactorx/router";
import { filter, groupBy, keys, last, map, noop } from "lodash";
import React, { ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";

import { examples, IExample } from "./exmaple";

const ExampleSection = ({ children }: { children?: ReactNode }) => (
  <div
    css={selector().position("relative").padding(themes.space.s4).with(selector("& + &").marginTop(themes.space.s4))}>
    {children}
  </div>
);

const ExampleBlock = ({ name, module, group, source, examples }: IExample) => {
  return (
    <div
      css={selector()
        .position("relative")
        .backgroundColor(themes.state.backgroundColor)
        .color(themes.state.color)
        .paddingY(themes.space.s5)
        .paddingX(themes.space.s4)
        .with(selector("& + &").borderTopWidth(1).borderTopStyle("solid").borderColor(themes.state.borderColor))}>
      <div
        css={selector()
          .position("absolute")
          .top(0)
          .right(0)
          .paddingX(themes.space.s4)
          .paddingY(themes.space.s2)
          .fontSize(themes.fontSizes.s)
          .opacity(0.3)}>
        {group}/{module}/{name}
      </div>
      <Stack inline spacing={themes.space.s2}>
        <div
          css={selector()
            .flex(1)
            .borderWidth(1)
            .borderStyle("solid")
            .borderRadius(themes.radii.normal)
            .borderColor(themes.state.borderColor)}>
          {map(examples, (Example, key) => (
            <ExampleSection key={key}>
              <Example />
            </ExampleSection>
          ))}
        </div>
        {!!source && (
          <div css={selector().borderBottomRadius(themes.radii.normal).fontSize("0.6em").width("30%")}>
            <CodeBlock>{source}</CodeBlock>
          </div>
        )}
      </Stack>
    </div>
  );
};

const Sidebar = withBackground(colors.gray9)(({ group, examples }: { group: string; examples: IExample[] }) => {
  const { location } = useRouter();

  return (
    <ul
      css={selector()
        .padding(themes.space.s3)
        .fontSize(themes.fontSizes.s)
        .backgroundColor(themes.state.backgroundColor)
        .color(themes.state.color)
        .lineHeight(themes.lineHeights.normal)
        .position("relative")
        .width(260)
        .margin(0)
        .overflowX("hidden")
        .overflowY("auto")
        .listStyle("none")
        .with(
          selector("& ul")
            .color("inherit")
            .paddingLeft(themes.space.s1)
            .paddingY(themes.space.s1)
            .margin(0)
            .listStyle("none"),
        )
        .with(
          selector("& a")
            .color("inherit")
            .textDecoration("none")
            .opacity(0.8)
            .paddingY(themes.space.s1)
            .with(selector("&:hover", "&[data-current=true]").opacity(1)),
        )}>
      {map(
        groupBy(examples, (e) => e.module),
        (examples, module) => (
          <li key={module}>
            <NavLink to={`/${group}/${module}${location.search}`}>
              <div css={selector().display("flex").alignItems("center").justifyContent("space-between")}>
                <div>{`${group}/${module}`}</div>
                <img
                  style={{
                    height: "0.8em",
                  }}
                  src={`//img.shields.io/npm/v/${group}/${module}.svg?style=flat-square`}
                />
              </div>
            </NavLink>
            <ul>
              {map(examples, (e) => (
                <li key={e.name}>
                  <NavLink to={`/${group}/${module}/${e.name}${location.search}`}>{e.name}</NavLink>
                </li>
              ))}
            </ul>
          </li>
        ),
      )}
    </ul>
  );
});

const List = ({ filterBy }: { filterBy: { group?: string; module?: string; name?: string } }) => {
  const matched =
    filterBy.group || filterBy.module || filterBy.name
      ? filter(examples, (e) => {
          if (filterBy.name) {
            return e.group === filterBy.group && e.module === filterBy.module && e.name === filterBy.name;
          }
          if (filterBy.module) {
            return e.group === filterBy.group && e.module === filterBy.module;
          }
          return e.group === filterBy.group;
        })
      : examples;

  return (
    <>
      {map(matched, (ex) => {
        return <ExampleBlock {...ex} key={`${ex.group}:${ex.module}:${ex.name}`} />;
      })}
    </>
  );
};

const Nav = withBackground(colors.gray9)(({ groups }: { groups: string[] }) => {
  const { location } = useRouter();
  const { dark } = parseSearchString(location.search);

  return (
    <Stack
      inline
      justify={"flex-end"}
      spacing={themes.space.s3}
      css={selector()
        .paddingX(themes.space.s3)
        .fontSize(themes.fontSizes.s)
        .position("relative")
        .zIndex(10)
        .boxShadow(shadows.medium)
        .paddingY(themes.space.s2)
        .backgroundColor(themes.state.backgroundColor)
        .color(themes.state.color)
        .with(selector("& a").color(themes.state.color).textDecoration("none"))}>
      {map(groups, (g) => (
        <NavLink key={g} to={`/${g}${location.search}`}>
          {g}
        </NavLink>
      ))}

      <NavLink key={"toggle"} to={dark ? `${location.pathname}` : `${location.pathname}?dark=1`}>
        <Switch value={!!dark} onValueChange={noop} />
      </NavLink>
    </Stack>
  );
});

const ComponentDocsMain = ({ match }: IRoute<{ group?: string; module?: string; name?: string }>) => {
  const groups = groupBy(examples, (e) => e.group);

  return (
    <Stack
      align={"stretch"}
      css={selector().with(cover()).backgroundColor(themes.state.backgroundColor).color(themes.state.color)}>
      <Nav groups={keys(groups)} />
      <Stack inline align={"stretch"} css={{ flex: 1, overflow: "hidden" }}>
        {match.params.group ? (
          <>
            <Sidebar group={match.params.group} examples={groups[match.params.group]} />
            <div css={selector().flex(1).position("relative").overflowX("hidden").overflowY("auto")}>
              <List filterBy={match.params} />
            </div>
          </>
        ) : (
          <Redirect to={`/${last(keys(groups))}`} />
        )}
      </Stack>
    </Stack>
  );
};

export const ComponentDocs = (props: IRoute<{ group?: string; module?: string; name?: string }>) => {
  const { location } = useRouter();
  const { dark } = parseSearchString(location.search);

  return dark ? (
    <ThemeState borderColor={rgba(colors.gray4, 0.15)} color={colors.gray4} backgroundColor={colors.gray8}>
      <ComponentDocsMain {...props} />
    </ThemeState>
  ) : (
    <ComponentDocsMain {...props} />
  );
};
