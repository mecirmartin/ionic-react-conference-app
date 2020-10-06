//@ts-ignore
import jsx from 'acorn-jsx'
import * as acorn from 'acorn'

function onMouseHandler(e: any) {
  console.log("event target type", e)
  console.log("Target dir", e.target.outerHTML)
  const stringCode = e.target.outerHTML
  console.log("SringCode", stringCode, "Type", typeof (stringCode), "Target", e.target)
  const parsedtarget = acorn.Parser.extend(jsx()).parse(stringCode)
  //@ts-ignore
  console.log("Parsed Target", parsedtarget)
  // const parsedCode = acorn.Parser.extend(jsx()).parse(code)
  // console.log("Parsed Code with Acorn", parsedCode)
  return parsedtarget
}


const inputs = `
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
`

export const code = `
function main() {
  const App = () => (
    <IonContent>
      <IonGrid
        onMouseOver={(e) => {highlight(e.target);  onMouseHandler(e);}}
        onClick={(e) => {handleClick(e); cloneElement(e) }}
        className="ion-padding"
      >
        <IonRow>
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
            <IonList>
              
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
