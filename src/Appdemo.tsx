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
import { code } from "./util/code";
import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Route } from "react-router";
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

const handleClick = (e: React.MouseEvent) => {
  if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent) return;

  const id = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.getIDForNode(
    e.target
  );
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.logElementToConsole({
    id,
    rendererID: 1,
  });
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.selectNode(e.target);
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

const Home: React.FC = () => (
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
