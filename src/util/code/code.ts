export const initialCode = `
function main() {
  const App = () => (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your new App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonGrid onMouseOver={(e) => {highlight(e.target);}} onClick={(e) => {getDimensions(e);handleClick(e)}}>
        <IonRow>
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
