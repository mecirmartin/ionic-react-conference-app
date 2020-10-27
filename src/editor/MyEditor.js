import React, { createRef, Component, Fragment } from "react";
import PropTypes from "prop-types";
import Highlight, { Prism } from "prism-react-renderer";
import { ControlledEditor } from "@monaco-editor/react";

import monacoSetup from "../editor/monacoSetup";

class MyEditor extends Component {
  constructor() {
    super();
    this.editorRef = createRef();
  }
  static propTypes = {
    code: PropTypes.string,
    disabled: PropTypes.bool,
    language: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    theme: PropTypes.object,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.code !== state.prevCodeProp) {
      return { code: props.code, prevCodeProp: props.code };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const start = this.props.currentLine;
    const { code } = this.props.code;
    if (code !== prevProps.code && this.editorRef.current) {
      this.editorRef.current.trigger(
        "anyString",
        "editor.action.formatDocument"
      );
    }
    if (start !== prevProps.currentLine.start && this.editorRef.current) {
      if (start) {
        const { current: editor } = this.editorRef;
        editor.focus();
        editor.revealLineInCenter(start + 4);
        const startOfTheLine = editor
          .getModel()
          .getLineFirstNonWhitespaceColumn(start + 1);
        editor.setPosition({
          lineNumber: start + 1,
          column: startOfTheLine,
        });
      }
    }
  }

  state = {
    code: "",
  };

  handleEditorDidMount = (_, editor) => {
    monacoSetup();
    this.editorRef.current = editor;
  };

  updateContent = (_, value) => {
    this.setState({ value }, () => {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    });
  };

  highlightCode = (code) => (
    <Highlight
      Prism={Prism}
      code={code}
      theme={this.props.theme}
      language={this.props.language}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <Fragment>
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Fragment>
      )}
    </Highlight>
  );

  render() {
    // eslint-disable-next-line no-unused-vars
    const { code } = this.state;

    return (
      <ControlledEditor
        height="50vh"
        value={code}
        onChange={this.updateContent}
        editorDidMount={this.handleEditorDidMount}
        language="javascript"
      />
    );
  }
}

export default MyEditor;
