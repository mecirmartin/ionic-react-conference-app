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
            {/*-- List of Text Items --*/}
            <IonList>
              <IonItem>
                <IonLabel id='1'>Pokémon Yellow</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel id='2'>Mega Man X</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel id='3'>The Legend of Zelda</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel id='4'>Pac-Man</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel id='5'>Super Mario World</IonLabel>
              </IonItem>
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
