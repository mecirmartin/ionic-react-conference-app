export const buttonSnippet = `
<IonButton>Edit me!</IonButton>
`;

export const listSnippet = `
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
`;

export const cardSnippet = `
    <IonCard className="speaker-card">
        <IonCardHeader>
        <IonItem button detail={false} lines="none">
            <IonAvatar slot="start">
            <img src="https://icons.iconarchive.com/icons/sora-meliae/matrilineare/72/avatar-default-icon.png" alt="Speaker profile pic" />
            </IonAvatar>
            <IonLabel>
                <h2>Meno</h2>
                <p>Priezvisko</p>
            </IonLabel>
        </IonItem>
        </IonCardHeader>

        <IonCardContent>
        <IonList lines="none">
            <IonItem detail={false} >
            <IonLabel>
                <p>Hi, I'm Martin</p>
            </IonLabel>
            </IonItem>
        </IonList>
        </IonCardContent>
    </IonCard>
`;

export const listItemSnippet = `
<IonItem>
    <IonLabel>Edit me!</IonLabel>
</IonItem>
`;

export const inputAndLabelSnippet = `
<IonItem>
    <IonLabel>InputLabel</IonLabel>
    <IonInput></IonInput>
</IonItem>
`;

export const formSnippet = `
<IonList>
    <IonItem>
        <IonLabel position="stacked">Stacked Label</IonLabel>
        <IonInput> </IonInput>
    </IonItem>
    <IonItem>
        <IonButton>Edit me!</IonButton>
    </IonItem>
</IonList>
`;

export const customCodeSnippet = `
<IonItem>
    <IonLabel position="floating">Insert code snippet: </IonLabel>
    <IonTextarea value={customSnippet} onIonChange={e => setCustomSnippet(e.detail.value)}></IonTextarea>
    <IonButton onClick={(e) => console.log(addSnippet(e,customSnippet))}>Add custom element</IonButton>
</IonItem>
`;
