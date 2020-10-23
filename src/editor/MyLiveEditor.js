import React from "react";
import { LiveContext } from "react-live";
import MyEditor from "./MyEditor";

export default function MyLiveEditor(props) {
  return (
    <LiveContext.Consumer>
      {({ code, language, theme, disabled, onChange }) => (
        <MyEditor
          theme={theme}
          code={code}
          language={language}
          disabled={disabled}
          onChange={onChange}
          {...props}
        />
      )}
    </LiveContext.Consumer>
  );
}
