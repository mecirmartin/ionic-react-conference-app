import React, { useState } from "react";
import { LiveProvider, LiveError, LivePreview } from "react-live";
import { Route } from "react-router";
import { transformSync } from "@babel/core";
// Ionic imports
import * as ionic from "@ionic/react";
import {
  IonCol,
  IonRow,
  IonGrid,
  IonApp,
  IonPage,
  IonRouterOutlet,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
// Ionic CSS imports
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
// Local imports
import "./util/ionic.css";
import "./App.css";
import DevTools from "./devtools/devtools";
import customPlugin from "./util/babelCustomPlugin";
import MyLiveEditor from "./editor/MyLiveEditor";
import { initialCode } from "./util/code/code";
import { areaStyle, xStyle, yStyle, getOffset } from "./util/higlight";
import { changeFrameBorderStyle, getLineNumbers } from "./util/helperFunctions";
import {
  addSnippetToCode,
  cloneElementInCode,
  deleteElementInCode,
} from "./util/codeHandlers";
import {
  buttonSnippet,
  cardSnippet,
  customCodeSnippet,
  formSnippet,
  inputAndLabelSnippet,
  listItemSnippet,
  listSnippet,
} from "./util/code/codeSnippets";

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
  const [focusedLine, setFocusedLine] = useState<number>(0);
  const [action, setAction] = useState<string>("clone");
  const [customSnippet, setCustomSnippet] = useState<string>("");
  const [currentPositionInCode, setCurrentPositionInCode] = useState<{
    start: number | null;
    end: number | null;
  }>({
    start: null,
    end: null,
  });
  let widthDimension: number = 0,
    heightDimension: number = 0,
    topDimension: number = 0,
    leftDimension: number = 0;

  const deleteElement = (): void => {
    const { start, end } = currentPositionInCode;
    const newCode = deleteElementInCode(code, start, end);
    if (!newCode) return;
    setCode(newCode);
  };

  const cloneElement = (): void => {
    const { start, end } = currentPositionInCode;
    const newCode = cloneElementInCode(code, start, end);
    if (!newCode) return;
    setCode(newCode);
  };

  const addSnippet = (snippet: string): void => {
    const { end } = currentPositionInCode;
    const newCode = addSnippetToCode(code, snippet, end);
    if (!newCode) return;
    setCode(newCode);
  };

  const setCurrentlyFocusedLine = () => {
    setFocusedLine(currentPositionInCode!.start || 0);
  };

  const handleClick = (e: any): void => {
    const { start, end } = getLineNumbers(e.target.className);
    setCurrentPositionInCode({ start, end });

    switch (action) {
      case "BUTTON":
        addSnippet(buttonSnippet);
        setAction("");
        break;
      case "LIST":
        addSnippet(listSnippet);
        setAction("");
        break;
      case "LIST_ITEM":
        addSnippet(listItemSnippet);
        setAction("");
        break;
      case "INPUT_AND_LABEL":
        addSnippet(inputAndLabelSnippet);
        setAction("");
        break;
      case "FORM":
        addSnippet(formSnippet);
        setAction("");
        break;
      case "CUSTOM_SNIPPET":
        addSnippet(customCodeSnippet);
        setAction("");
        break;
      case "CARD":
        addSnippet(cardSnippet);
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

  const getDimensions = () => {
    //@ts-ignore
    widthDimension = parseInt(dom.area.style.width.slice(0, -2));
    //@ts-ignore
    heightDimension = parseInt(dom.area.style.height.slice(0, -2));
    //@ts-ignore
    topDimension = parseInt(dom.area.style.top.slice(0, -2));
    //@ts-ignore
    leftDimension = parseInt(dom.area.style.left.slice(0, -2));

    const currentElement = document.getElementById("buttonContainer")!;
    currentElement.style.width = `${widthDimension}px`;
    currentElement.style.height = `${heightDimension}px`;
    currentElement.style.transform = `translate3d(${leftDimension}px, ${topDimension}px, 0px)`;
  };

  const scope = {
    ...ionic,
    IonReactRouter,
    Route,
    highlight,
    handleClick,
    customSnippet,
    setCustomSnippet,
    addSnippet,
    getDimensions,
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
          <div
            id="buttonContainer"
            className="ic-select-box ic-select-box-can-delete"
            style={{
              width: widthDimension,
              height: heightDimension,
              top: 0,
              left: 0,
              transform: `translate3d(${topDimension}px, ${leftDimension}px, 0px)`,
            }}
          >
            <div>
              <div className="control-container">
                <a
                  className="select-duplicate"
                  href="#"
                  onClick={cloneElement}
                  onMouseOver={() =>
                    changeFrameBorderStyle("1px solid #54d77e")
                  }
                  onMouseOut={() => changeFrameBorderStyle("1px solid #4a87ee")}
                ></a>
                <a
                  className="select-remove"
                  href="#"
                  onClick={deleteElement}
                  onMouseOver={() =>
                    changeFrameBorderStyle("1px solid #ef4e3a")
                  }
                  onMouseOut={() => changeFrameBorderStyle("1px solid #4a87ee")}
                ></a>
              </div>
            </div>
          </div>
          <IonSelect
            value={action}
            placeholder="Select One"
            onIonChange={(e) => setAction(e.detail.value)}
          >
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
              <MyLiveEditor currentLine={focusedLine} />
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
