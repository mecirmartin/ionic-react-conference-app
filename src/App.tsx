import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
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

  Object.assign(dom.area.style, {
    position: "fixed",
    backgroundColor: "rgba(0, 136, 204, 0.2)",
    zIndex: "2147483647",
    pointerEvents: "none",
  });

  Object.assign(dom.x.style, {
    position: "fixed",
    borderStyle: "dashed",
    borderColor: "rgb(0, 136, 204)",
    borderWidth: "1px 0",
    zIndex: "2147483647",
    left: "0",
    width: "100vw",
    pointerEvents: "none",
  });

  Object.assign(dom.y.style, {
    position: "fixed",
    borderStyle: "dashed",
    borderColor: "rgb(0, 136, 204)",
    borderWidth: "0 1px",
    zIndex: "2147483647",
    top: "0",
    height: "100vh",
    pointerEvents: "none",
  });

  function getOffset(element: EventTarget) {
    const castedElement = element as HTMLElement;
    const styles = getComputedStyle(castedElement);

    const margin = {
      top: Math.max(parseInt(styles.marginTop!), 0),
      right: Math.max(parseInt(styles.marginRight!), 0),
      bottom: Math.max(parseInt(styles.marginBottom!), 0),
      left: Math.max(parseInt(styles.marginLeft!), 0),
    };

    const rect: any = {
      width: castedElement.offsetWidth + margin.right + margin.left,
      height: castedElement.offsetHeight + margin.top + margin.bottom,
      top: castedElement.offsetTop - margin.top,
      left: castedElement.offsetLeft - margin.left,
    };

    let parent: any = castedElement;
    while ((parent = parent.offsetParent)) {
      rect.top += parent.offsetTop;
      rect.left += parent.offsetLeft;
    }

    parent = castedElement;
    while ((parent = parent.parentElement)) {
      rect.top -= parent.scrollTop;
      rect.left -= parent.scrollLeft;
    }

    rect.right = rect.left + rect.width;
    rect.bottom = rect.top + rect.height;

    return rect;
  }

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
      height: box.height - 2 + "px",
    });
    document.body.append(dom.x);

    Object.assign(dom.y.style, {
      left: box.left + "px",
      width: box.width - 2 + "px",
    });
    document.body.append(dom.y);
  }

  const handleMouseOver = (e: React.MouseEvent) => {
    console.log(e.target);
    //window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.logElementToConsole({id: 37, rendererID:1})T
    highlight(e.target);
  };
  return schedule.groups.length === 0 ? (
    <div></div>
  ) : (
    <IonApp
      onMouseOver={handleMouseOver}
      className={`${darkMode ? "dark-theme" : ""}`}
    >
      <IonReactRouter>
        <IonSplitPane contentId="main">
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
