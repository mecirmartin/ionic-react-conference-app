import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import {
  IonApp,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonRouterOutlet,
  IonRow,
  IonSplitPane,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Menu from "./components/Menu";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import MainTabs from "./pages/MainTabs";
import { connect } from "./data/connect";
import { AppContextProvider } from "./data/AppContext";
import { loadConfData } from "./data/sessions/sessions.actions";
import {
  setIsLoggedIn,
  setUsername,
  loadUserData,
} from "./data/user/user.actions";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Support from "./pages/Support";
import Tutorial from "./pages/Tutorial";
import HomeOrTutorial from "./components/HomeOrTutorial";
import { Schedule } from "./models/Schedule";
import RedirectToLogin from "./components/RedirectToLogin";
import DevTools from "./devtools/devtools";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

import { areaStyle, getOffset, xStyle, yStyle } from "./util/higlight";
import { code } from "./util/code";
// @ts-ignore
import styles from "./devtools/devtoolsStyles.css";
import { findByLabelText } from "@testing-library/react";
import { relative } from "path";

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
  }
}

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonicAppConnected />
    </AppContextProvider>
  );
};

interface StateProps {
  darkMode: boolean;
  schedule: Schedule;
}

interface DispatchProps {
  loadConfData: typeof loadConfData;
  loadUserData: typeof loadUserData;
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
}

interface IonicAppProps extends StateProps, DispatchProps {}

const IonicApp: React.FC<IonicAppProps> = ({
  darkMode,
  schedule,
  setIsLoggedIn,
  setUsername,
  loadConfData,
  loadUserData,
}) => {
  useEffect(() => {
    loadUserData();
    loadConfData();
    // eslint-disable-next-line
  }, []);

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
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.logElementToConsole(
      {
        id,
        rendererID: 1,
      }
    );
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.selectNode(
      e.target
    );
  };

  return schedule.groups.length === 0 ? (
    <div></div>
  ) : (
    <IonApp onClick={handleClick} className={`${darkMode ? "dark-theme" : ""}`}>
      <IonContent>
        <IonGrid className="main-grid">
          {" "}
          <IonRow>
            <IonReactRouter>
              <IonSplitPane
                contentId="main"
                onMouseOver={(e) => highlight(e.target)}
              >
                <Menu />
                <IonRouterOutlet id="main">
                  {/*
                We use IonRoute here to keep the tabs state intact,
                which makes transitions between tabs and non tab pages smooth
                */}
                  <Route path="/tabs" render={() => <MainTabs />} />
                  <Route path="/account" component={Account} />
                  <Route path="/login" component={Login} />
                  <Route path="/signup" component={Signup} />
                  <Route path="/support" component={Support} />
                  <Route path="/tutorial" component={Tutorial} />
                  <Route
                    path="/logout"
                    render={() => {
                      return (
                        <RedirectToLogin
                          setIsLoggedIn={setIsLoggedIn}
                          setUsername={setUsername}
                        />
                      );
                    }}
                  />
                  <Route path="/" component={HomeOrTutorial} exact />
                </IonRouterOutlet>
              </IonSplitPane>
            </IonReactRouter>
          </IonRow>
          <IonRow className="bottom-row">
            {" "}
            <IonCol>
              <LiveProvider code={code}>
                <LiveEditor />
              </LiveProvider>
            </IonCol>
            <IonCol>
              <DevTools window={window} tabID="components" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonApp>
  );
};

export default App;

const IonicAppConnected = connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    schedule: state.data.schedule,
  }),
  mapDispatchToProps: {
    loadConfData,
    loadUserData,
    setIsLoggedIn,
    setUsername,
  },
  component: IonicApp,
});
