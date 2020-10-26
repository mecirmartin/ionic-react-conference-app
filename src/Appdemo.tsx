import React, { useEffect, useState } from "react";
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
  IonButton,
  IonModal,
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
import Border from "./elements/Border";
//import { getFilesFromGitlab, loadFile } from './gitlab/gitlabFunctions'

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
  const [borderStyle, setBorderStyle] = useState<string>('1px solid #4a87ee')
  const [customSnippet, setCustomSnippet] = useState<string>("");
  const [files, setFiles] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [gitlabCode, setGitlabcode] = useState<any>('')
  const [fileName, setFileName] = useState<any>()
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

  const loadFile = async () => {
    const endpoint = `https://gitlab.com/api/v4/projects/21967675/repository/files/githubapi%2Fsrc%2Fcomponents%2F${fileName}?ref=master
    `
    await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        cache: 'no-store',
        //Authorization: "Bearer token" 
        //...(headers || window.endpointHeaders)
      }
    })
      .then(res => {
        var responseData;
        console.log("res", res)
        res.json().then(data => { console.log("GITHUBREPOSNE", data); let resData = atob(data.content); setGitlabcode(resData); })

        console.log("RESPONSE", responseData)
        //console.log("RESSSS", response)
      })
      .then(data => {

      })

  }

  async function getFilesFromGitlab() {
    const endpoint = 'https://gitlab.com/api/v4/projects/21967675/repository/tree?path=githubapi/src/components/'
    await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        cache: 'no-store',
        //Authorization: "Bearer token" 
        //...(headers || window.endpointHeaders)
      }
    })
      .then(res => {
        var responseData;
        res.json().then(data => { setFiles(data); console.log("DATATA", data) })
        console.log("RESPONSE", responseData)
        //console.log("RESSSS", response)
      })
  }



  useEffect(() => {
    function getData() {
      getFilesFromGitlab()
    }
    getData()
  }, [])

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
          <Border
            setActive={() => { setCurrentlyFocusedLine() }}
            greenBorder={() => { changeFrameBorderStyle("1px solid #54d77e"); setBorderStyle("1px solid #54d77e") }}
            redBorder={() => { changeFrameBorderStyle("1px solid #ef4e3a"); setBorderStyle("1px solid #ef4e3a") }}
            cloneElement={cloneElement}
            deleteElement={deleteElement}
            onMouseOut={() => changeFrameBorderStyle("1px solid #4a87ee")}
            widthDimension={widthDimension} topDimension={topDimension}
            leftDimension={leftDimension} heightDimension={heightDimension}
            borderStyle={borderStyle} />

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
          <IonModal isOpen={showModal} cssClass='my-custom-class'>
            <div>
              <h2>
                Pick which code from components message u want to pick
          </h2>
              <div>
                <IonSelect
                  value={fileName}
                  placeholder="Select File"
                  onIonChange={(e) => { console.log("FILENAME", e.detail.value); setFileName(e.detail.value); console.log("State filename", fileName) }}
                >
                  {files && files.map((file: any) => {
                    return (
                      <IonSelectOption value={file.name} key={file.id}>
                        {file.name}
                      </IonSelectOption>
                    )
                  })}
                </IonSelect>
              </div>
            </div>
            <IonButton onClick={(e) => { loadFile(); setShowModal(false); }}>Load File </IonButton>
          </IonModal>
          <IonButton title="Load Data from Gitlab" onClick={() => {
            setShowModal(true)
          }} >Load File From Gitlab</IonButton>
          <IonButton onClick={() => {
            setCode(gitlabCode)
          }} >Load File to LiveProvider</IonButton>
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
