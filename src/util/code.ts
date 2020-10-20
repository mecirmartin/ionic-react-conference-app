export const initialCode = `
function main() {
  const App = () => (
    <IonContent onMouseOver={(e) => {highlight(e.target)}} onClick={(e) => {getDimensions(e);handleClick(e)}}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your new App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonGrid>
        <IonRow>
          <IonCol size='6'>
            <IonList>
              <IonItem>
                <IonAvatar slot="start">
                    <img src="https://raw.githubusercontent.com/ionic-team/ionic-docs/master/src/demos/api/list/avatar-finn.png"/>
                </IonAvatar>
                <IonLabel>
                    <h2>Finn</h2>
                    <p>I'm a big deal</p>
                    <p>Listen, I've had a pretty messed up day...</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCol>
          <IonCol size='6'>
              <IonItem></IonItem>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" component={App} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

`;
