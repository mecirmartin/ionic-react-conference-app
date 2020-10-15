import {
  IonCol,
  IonRow,
  IonGrid,
  IonApp,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRouterOutlet,
  IonCheckbox,
  IonInput,
  IonRadio,
  IonToggle,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonContent,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { initialCode } from "./util/code";
import React, { useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Route } from "react-router";
import { transformSync } from "@babel/core";
import * as t from "@babel/types";
//@ts-ignore
/* import jsx from "acorn-jsx";
import * as acorn from "acorn"; */

import "./App.css";
import DevTools from "./devtools/devtools";
import { areaStyle, xStyle, yStyle, getOffset } from "./util/higlight";

const dom = {
  area: document.createElement("div"),
  x: document.createElement("div"),
  y: document.createElement("div"),
};

Object.assign(dom.area.style, areaStyle);

Object.assign(dom.x.style, xStyle);

Object.assign(dom.y.style, yStyle);

function highlight(element: EventTarget) {
  if (!element) {
    dom.area.remove();
    dom.x.remove();
    dom.y.remove();
    return;
  }

  const box = getOffset(element);
  Object.assign(dom.area.style, {
    top: box.top + "px",
    left: box.left + "px",
    width: box.width + "px",
    height: box.height + "px",
  });
  document.body.append(dom.area);

  Object.assign(dom.x.style, {
    top: box.top + "px",
    height: box.height + "px",
  });
  document.body.append(dom.x);

  Object.assign(dom.y.style, {
    left: box.left + "px",
    width: box.width + "px",
  });
  document.body.append(dom.y);
}

const Home: React.FC = () => {
  const [code, setCode] = useState<string>(initialCode);

  const getLineNumbers = (e: any): { start: number; end: number } => {
    // -1 because array is zero indexed
    const start = e.target.parentElement.getAttribute("data-source-begin") - 1;
    const end = e.target.parentElement.getAttribute("data-source-end") - 1;

    return { start, end };
  };

  const removeElement = (e: any): void => {
    const { start, end } = getLineNumbers(e);

    if (!start || !end)
      return console.warn("Element was not found in the code");

    const lineArray = code.split("\n");
    const newCode = [
      ...lineArray.slice(0, start),
      ...lineArray.slice(end + 1),
    ].join("\n");
    setCode(newCode);
  };

  const cloneElement = (e: any): void => {
    const { start, end } = getLineNumbers(e);

    if (!start || !end)
      return console.warn("Element was not found in the code");

    const lineArray = code.split("\n");
    const cloneLines: Array<string> = [];

    for (let i = start; i <= end; i++) {
      cloneLines.push(lineArray[i]);
    }

    lineArray.splice(end + 1, 0, ...cloneLines);
    const newCode = lineArray.join("\n");

    setCode(newCode);
  };

  const handleClick = (e: any): void => {
    removeElement(e);
    if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent) return;

    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.selectNode(
      e.target
    );
  };

  const scope = {
    IonPage,
    IonContent,
    IonApp,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonToggle,
    IonRadio,
    IonCheckbox,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonReactRouter,
    IonRouterOutlet,
    Route,
    highlight,
    handleClick,
  };

  const customPlugin = () => {
    return {
      visitor: {
        ReturnStatement(path: any) {
          path.skip();
        },
        JSXElement(path: any) {
          if (
            path.node.openingElement.name.name !== "span" &&
            path.node.openingElement.name.name !== "IonCol"
          ) {
            const nestedProp =
              (path.parent.openingElement &&
                path.parent.openingElement.name.name) ||
              "";
            if (nestedProp === "span") {
              if (!path.node.children.length) {
                return path.skip();
              }

              return t.traverse(path.node.children[0], customPlugin);
            }

            let start: number;
            let end: number;

            if (!path.node.children.length) {
              // Node has no children, it starts and ends on same line
              start = path.node.openingElement.loc.start.line;
              end = start;
            } else {
              // If node has multiple children, code starts at first childs, ends at last
              start = path.node.children[0].loc.start.line;
              end =
                path.node.children[path.node.children.length - 1].loc.end.line;
            }

            const spanId = t.jsxIdentifier("span");

            path.replaceWith(
              t.jsxElement(
                t.jsxOpeningElement(spanId, [
                  t.jsxAttribute(
                    t.jsxIdentifier("data-source-begin"),
                    t.stringLiteral(`${start}`)
                  ),
                  t.jsxAttribute(
                    t.jsxIdentifier("data-source-end"),
                    t.stringLiteral(`${end}`)
                  ),
                ]),
                t.jsxClosingElement(spanId),
                [path.node]
              )
            );
          }
        },
      },
    };
  };

  return (
    <IonPage>
      <IonGrid className="main-grid">
        <LiveProvider
          code={code}
          scope={scope}
          transformCode={(code) => {
            const transformedCode = transformSync(code, {
              filename: "code.ts",
              plugins: [require("@babel/plugin-syntax-jsx"), customPlugin],
            })!.code;
            if (!transformedCode)
              throw new Error("There was error during transpilation");
            console.log(transformedCode);
            return transformedCode;
          }}
        >
          <LivePreview />
          <IonRow className="bottom-row">
            {" "}
            <IonCol>
              <LiveEditor />
              <LiveError />
            </IonCol>
            <IonCol>
              <DevTools window={window} tabID="components" />
            </IonCol>
          </IonRow>
        </LiveProvider>
      </IonGrid>
    </IonPage>
  );
};

const Appdemo: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/" component={Home} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default Appdemo;
