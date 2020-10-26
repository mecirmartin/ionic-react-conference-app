import { monaco } from "@monaco-editor/react";
import monacoString from "../util/monacoString";

export default () => {
  monaco
    .init()
    .then((monaco) => {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: "React",
        allowJs: true,
        typeRoots: ["node_modules/@types"],
      });

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        monacoString,
        `file:///node_modules/@react/types/index.d.ts`
      );
    })
    .catch((error) =>
      console.error(
        "An error occurred during initialization of Monaco: ",
        error
      )
    );
};
