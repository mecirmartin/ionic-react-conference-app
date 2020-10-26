import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Highlight, { Prism } from "prism-react-renderer";
import { ControlledEditor } from "@monaco-editor/react";

import monacoSetup from "../editor/monacoSetup";

class MyEditor extends Component {
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

  state = {
    code: "",
  };

  componentDidMount() {
    monacoSetup();
  }

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
    const { style, code: _code, onChange, language, theme } = this.props;
    const { code } = this.state;

    return (
      <ControlledEditor
        height="50vh"
        value={code}
        onChange={this.updateContent}
        language="javascript"
      />
    );
  }
}

export default MyEditor;
