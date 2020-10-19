export const buttonSnippet = `
<IonButton>Edit me!</IonButton>
`;

export const listSnippet = `
<IonList>
    <IonItem>
        <IonLabel>Edit me!</IonLabel>
    </IonItem>
</IonList>
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
        <IonLabel>Input1</IonLabel>
        <IonInput></IonInput>
    </IonItem>
    <IonItem>
        <IonLabel>Input2</IonLabel>
        <IonInput></IonInput>
    </IonItem>
    <IonItem>
        <IonLabel>Input3</IonLabel>
        <IonInput></IonInput>
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
