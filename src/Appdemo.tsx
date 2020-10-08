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
import jsx from "acorn-jsx";
import * as acorn from "acorn";

import "./App.css";
import DevTools from "./devtools/devtools";
import { areaStyle, xStyle, yStyle, getOffset } from "./util/higlight";
import { stringify } from "querystring";

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

  const handleClick = (e: any): void => {
    const searchString = `id='${e.target.id}'`;
    const lines = code.split("\n");

    const idIndex = lines.findIndex((line) => line.includes(searchString));
    if (idIndex === -1 && !e.target.id) {
      console.warn("This component has no id assigned to it");
      return;
    }
    if (idIndex === -1 && e.target.id) {
      console.warn(`There is no component with id: ${searchString}`);
      return;
    }

    if (e.target.childElementCount === 0) {
      const lineToCopy = lines[idIndex];
      lines.splice(idIndex, 0, lineToCopy);
    } else {
      const linesToCopy: Array<string> = [];
      const tag = lines[idIndex].trim();
      const tempIndex = tag.search(searchString);
      const searchTag = tag.trim().slice(1, tempIndex).trim();
      const endingTag = `</${searchTag}>`;

      let foundEndingTag = false;
      let cloneIndex = idIndex;
      for (let i = idIndex; i < lines.length; i++) {
        linesToCopy.push(lines[i]);
        cloneIndex++;
        if (lines[i].trim() === endingTag) {
          foundEndingTag = true;
          break;
        }
      }
      if (!foundEndingTag) throw new Error("Ending tag not found");

      lines.splice(cloneIndex, 0, ...linesToCopy);
    }
    const newCode = lines.join("\n");
    setCode(newCode);

    /*const stringCode = e.target.outerHTML;
    const parsedtarget = acorn.Parser.extend(jsx()).parse(stringCode);

         const id = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.getIDForNode(
      e.target
    );
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.logElementToConsole(
      {
        id,
        rendererID: 1,
      }
    ); */

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
    //cloneElement,
  };

  return (
    <IonPage>
      <IonGrid className="main-grid">
        <LiveProvider
          code={code}
          scope={scope}
          transformCode={(code) => {
            const transformed = transformSync(code, {
              plugins: [
                require("@babel/plugin-syntax-jsx"),
                [
                  require("@babel/plugin-transform-react-jsx-source"),
                  { loose: true },
                ],
              ],
            })!.code;
            return code;
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
