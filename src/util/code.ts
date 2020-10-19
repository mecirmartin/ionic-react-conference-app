export const initialCode = `
function main() {
  const App = () => (
    <IonContent onMouseOver={(e) => highlight(e.target)} onClick={(e) => handleClick(e)} className="ion-padding">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your new App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonGrid>
        <IonRow>
          <IonCol size='6'>
            <IonItem></IonItem>
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
