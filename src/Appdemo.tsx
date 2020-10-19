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
  IonSelectOption,
  IonButton,
  IonTextarea,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { initialCode } from "./util/code";
import React, { useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Route } from "react-router";
import { transformSync } from "@babel/core";
import "./util/ionic.css";

import "./App.css";
import DevTools from "./devtools/devtools";
import customPlugin from "./util/babelCustomPlugin";
import { areaStyle, xStyle, yStyle, getOffset } from "./util/higlight";
import {
  buttonSnippet,
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
  const [elementForOperation, setElementForOperations] = useState()
  const [lines, setLines] = useState<any>()

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

  const deleting = () => {
    const { start, end } = lines

    if (!start || !end)
      return console.warn("Element was not found in the code");

    const lineArray = code.split("\n");
    const newCode = [
      ...lineArray.slice(0, start),
      ...lineArray.slice(end + 1),
    ].join("\n");
    setCode(newCode);
  }

  const clonning = () => {
    let { start, end } = lines
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
  }

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
    console.log("EL", elementForOperation)
    let line1 = getLineNumbers(e)
    console.log(line1)
    setLines(line1)
    if (action == null) {

    }
    console.log(lines)
    switch (action) {
      case "CLONE":
        cloneElement(e);
        break;
      case "DELETE":
        deleteElement(e);
        break;
      case "BUTTON":
        addSnippet(e, buttonSnippet);
        break;
      case "LIST":
        addSnippet(e, listSnippet);
        break;
      case "LIST_ITEM":
        addSnippet(e, listItemSnippet);
        break;
      case "INPUT_AND_LABEL":
        addSnippet(e, inputAndLabelSnippet);
        break;
      case "FORM":
        addSnippet(e, formSnippet);
        break;
      case "CUSTOM_SNIPPET":
        addSnippet(e, customCodeSnippet);
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

  var widthDimension: number = 0, heightDimension: number = 0, topDimension: number = 0, leftDimension: number = 0;
  const getDimensions = (e: any) => {
    //@ts-ignore
    widthDimension = parseInt(dom.area.style.width.slice(0, -2))
    //@ts-ignore
    heightDimension = parseInt(dom.area.style.height.slice(0, -2))
    //@ts-ignore
    topDimension = parseInt(dom.area.style.top.slice(0, -2))
    //@ts-ignore
    leftDimension = parseInt(dom.area.style.left.slice(0, -2))
    console.log('WIDTH', widthDimension, heightDimension, leftDimension, topDimension)
    console.log("TYPE WIDTH", typeof (widthDimension))
    //@ts-ignore
    document.getElementById('buttonContainer').style.width = `${widthDimension}px`;
    //@ts-ignore
    document.getElementById('buttonContainer').style.height = `${heightDimension}px`;
    //@ts-ignore
    document.getElementById('buttonContainer').style.transform = `translate3d(${leftDimension}px, ${topDimension}px, 0px)`;
    //@ts-ignore
    //document.getElementById('buttonContainer').style.transform = `translate3d(8px, -460px,0px)`;

    //console.log('translate3d(10px, 275px, 0px)')
    //@ts-ignore
    console.log("TRANSFORM STYLE", document.getElementById('buttonContainer').style)
    setElementForOperations(e);
    console.log("AFTER DIMENSIONS1", e)

    console.log("AFTER DIMENSIONS", elementForOperation)

  }

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
    Route,
    highlight,
    handleClick,
    customSnippet,
    setCustomSnippet,
    addSnippet,
    getDimensions
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
          <div id="buttonContainer" onClick={() => console.log("DIVKO")} className="ic-select-box ic-select-box-can-delete" style={{ width: widthDimension, height: heightDimension, top: 0, left: 0, transform: `translate3d(${topDimension}px, ${leftDimension}px, 0px)` }}>
            <div>
              <div className="control-container">
                <a className="select-duplicate" href="#" onClick={(e) => { console.log("BEFORE CLONNING", elementForOperation); clonning() }}></a>
                <a className="select-remove" href="#" onClick={(e) => { deleting() }}></a>
              </div>
            </div>
          </div>
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
