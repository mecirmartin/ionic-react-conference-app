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
  IonSelect,
  IonToolbar,
  IonSelectOption,
  IonButton,
  IonTextarea,
  IonTitle,
  IonCardHeader,
  IonCardContent,
  IonCard,
  IonListHeader,
  IonAvatar,
  IonHeader,
} from "@ionic/react";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import { IonReactRouter } from "@ionic/react-router";
import { initialCode } from "./util/code";
import React, { useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Route } from "react-router";
import { transformSync } from "@babel/core";

import "./App.css";
import DevTools from "./devtools/devtools";
import customPlugin from "./util/babelCustomPlugin";
import { areaStyle, xStyle, yStyle, getOffset } from "./util/higlight";
import {
  buttonSnippet,
  cardSnippet,
  customCodeSnippet,
  formSnippet,
  inputAndLabelSnippet,
  listItemSnippet,
  listSnippet,
} from "./util/codeSnippets";

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
  const [action, setAction] = useState<string>("clone");
  const [customSnippet, setCustomSnippet] = useState<string>("");

  const getLineNumbers = (e: any): { start: number; end: number } => {
    // -1 because array is zero indexed
    const start = e.target.parentElement.getAttribute("data-source-begin") - 1;
    const end = e.target.parentElement.getAttribute("data-source-end") - 1;

    return { start, end };
  };

  const deleteElement = (e: any): void => {
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

  const addSnippet = (e: any, snipet: string): void => {
    const { start, end } = getLineNumbers(e);

    if (!snipet) return console.warn("No code snippet was provided");

    if (!start || !end)
      return console.warn("Element was not found in the code");

    const lineArray = code.split("\n");

    lineArray.splice(end + 1, 0, snipet);
    const newCode = lineArray.join("\n");

    setCode(newCode);
  };

  const handleClick = (e: any): void => {
    switch (action) {
      case "CLONE":
        cloneElement(e);
        setAction("");
        break;
      case "DELETE":
        deleteElement(e);
        setAction("");
        break;
      case "BUTTON":
        addSnippet(e, buttonSnippet);
        setAction("");
        break;
      case "LIST":
        addSnippet(e, listSnippet);
        setAction("");
        break;
      case "LIST_ITEM":
        addSnippet(e, listItemSnippet);
        setAction("");
        break;
      case "INPUT_AND_LABEL":
        addSnippet(e, inputAndLabelSnippet);
        setAction("");
        break;
      case "FORM":
        addSnippet(e, formSnippet);
        setAction("");
        break;
      case "CUSTOM_SNIPPET":
        addSnippet(e, customCodeSnippet);
        setAction("");
        break;
      case "CARD":
        addSnippet(e, cardSnippet);
        setAction("");
        break;

      default:
        return;
    }

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
    IonButton,
    IonTextarea,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonListHeader,
    IonAvatar,
    IonCardHeader,
    IonCardContent,
    IonCard,
    Route,
    highlight,
    handleClick,
    customSnippet,
    setCustomSnippet,
    addSnippet,
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
            return transformedCode;
          }}
        >
          <LivePreview />
          <IonSelect
            value={action}
            placeholder="Select One"
            onIonChange={(e) => setAction(e.detail.value)}
          >
            <IonSelectOption value="CLONE">Clone</IonSelectOption>
            <IonSelectOption value="DELETE">Delete</IonSelectOption>
            <IonSelectOption value="BUTTON">Add Button</IonSelectOption>
            <IonSelectOption value="LIST">Add List</IonSelectOption>
            <IonSelectOption value="LIST_ITEM">Add List Item</IonSelectOption>
            <IonSelectOption value="INPUT_AND_LABEL">
              Add Input with Label
            </IonSelectOption>
            <IonSelectOption value="FORM">Add Form</IonSelectOption>
            <IonSelectOption value="CARD">Add Card</IonSelectOption>
            <IonSelectOption value="CUSTOM_SNIPPET">
              Add Element from code snippet
            </IonSelectOption>
          </IonSelect>
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
