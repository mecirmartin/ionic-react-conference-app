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
/* function cloneElement(e: any) {
  let parent = e.target.parentNode;
  let clone = parent.cloneNode(true);
  parent.after(clone);
  console.log("Parent", parent);
} */

const Home: React.FC = () => {
  const [code, setCode] = useState<string>(initialCode);

  const getLineNumbers = (id: string): { startTag: number; endTag: number } => {
    let startTag = 0,
      endTag = 0;
    transformSync(code, {
      filename: "code.ts",
      plugins: [
        function myCustomPlugin() {
          return {
            visitor: {
              JSXElement(path: any) {
                if (path.node.openingElement.name.name === "span") {
                  if (
                    path.node.openingElement.attributes[0].value.extra
                      .rawValue === id
                  ) {
                    // -1 because array with lines of code will be 0 indexed
                    startTag = path.node.children[0].loc.start.line - 1;
                    endTag =
                      path.node.children[path.node.children.length - 1].loc.end
                        .line - 1;
                  }
                }
              },
            },
          };
        },
        require("@babel/plugin-syntax-jsx"),
        [require("@babel/plugin-transform-react-jsx-source"), { loose: true }],
      ],
    });
    return {
      startTag,
      endTag,
    };
  };

  const handleClick = (e: any): void => {
    const id = e.target.parentElement.getAttribute("data-source-begin");
    const { startTag, endTag } = getLineNumbers(id);

    if (!startTag && !endTag) return console.warn("Something went wrong");

    const lineArray = code.split("\n");
    const cloneLines: Array<string> = [];

    for (let i = startTag; i <= endTag; i++) {
      cloneLines.push(lineArray[i]);
    }

    // Double check if we copied whole span
    if (cloneLines[cloneLines.length - 1].trim() !== "</span>")
      return console.warn("Something went wrong");

    lineArray.splice(endTag + 1, 0, ...cloneLines);
    const newCode = lineArray.join("\n");

    setCode(newCode);

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

  return (
    <IonPage>
      <IonGrid className="main-grid">
        <LiveProvider code={code} scope={scope}>
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
