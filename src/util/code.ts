export const initialCode = `
function main() {
  const App = () => (
    <IonContent>
      <IonGrid
        onMouseOver={(e) => highlight(e.target)}
        onClick={(e) => handleClick(e)}
        className="ion-padding"
      >
        <IonRow >
          <IonCol>
            <IonList>
              <span data-source-begin='1'>
                <IonItem>
                  <IonLabel>Pokemon Yellow</IonLabel>
                </IonItem>
              </span>
              <span data-source-begin='2'>
                <IonItem>
                  <IonLabel>Mega Man X</IonLabel>
                </IonItem>
              </span>
              <span data-source-begin='3'>
                <IonItem>
                  <IonLabel>The Legend of Zelda</IonLabel>
                </IonItem>
              </span>
              <span data-source-begin='4'>
                <IonItem>
                  <IonLabel>Pac-Man</IonLabel>
                </IonItem>
              </span>
              <span data-source-begin='5'>
                <IonItem>
                  <IonLabel>Super Mario World</IonLabel>
                </IonItem>
              </span>
            </IonList>
          </IonCol>
          <IonCol>
            <IonList id='6'>
              <IonItem>
                <IonLabel>InputLabel</IonLabel>
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
