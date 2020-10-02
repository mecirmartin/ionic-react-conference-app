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
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { code } from "./util/code";
import React from "react";
import { LiveProvider, LiveEditor, LiveError } from "react-live";
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

const Home: React.FC = () => (
  <IonPage>
    <IonGrid className="main-grid">
      <IonRow
        onClick={(e) => handleClick(e)}
        onMouseOver={(e) => highlight(e.target)}
      >
        <IonCol>
          {/*-- List of Text Items --*/}
          <IonList>
            <IonItem>
              <IonLabel>Pokémon Yellow</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Mega Man X</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>The Legend of Zelda</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Pac-Man</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Super Mario World</IonLabel>
            </IonItem>
          </IonList>
        </IonCol>
        <IonCol>
          {/*-- List of Input Items --*/}
          <IonList>
            <IonItem>
              <IonLabel>Input</IonLabel>
              <IonInput></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Toggle</IonLabel>
              <IonToggle slot="end"></IonToggle>
            </IonItem>
            <IonItem>
              <IonLabel>Radio</IonLabel>
              <IonRadio slot="end"></IonRadio>
            </IonItem>
            <IonItem>
              <IonLabel>Checkbox</IonLabel>
              <IonCheckbox slot="start" />
            </IonItem>
          </IonList>
        </IonCol>
        <IonCol>
          {/*-- List of Sliding Items --*/}
          <IonList>
            <IonItemSliding>
              <IonItem>
                <IonLabel>Item</IonLabel>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption onClick={() => {}}>Unread</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>

            <IonItemSliding>
              <IonItem>
                <IonLabel>Item</IonLabel>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption onClick={() => {}}>Unread</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          </IonList>
        </IonCol>
      </IonRow>
      <IonRow className="bottom-row">
        {" "}
        <IonCol>
          <LiveProvider code={code}>
            <LiveEditor />
            <LiveError />
          </LiveProvider>
        </IonCol>
        <IonCol>
          <DevTools window={window} tabID="components" />
        </IonCol>
      </IonRow>
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
