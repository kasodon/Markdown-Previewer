import React from "react";
import ReactDOM from "react-dom";
import SplitterLayout from "react-splitter-layout";
import styled from "styled-components";
import { css } from "styled-components";
import marked from "marked";

import "./styles.css";

marked.setOptions({
  breaks: true
});

const SMALL_SCREEN = 599;

const defaultText = `
  # Markdown Previewer
  --------------------

  # This is an H1 header

  ## This is an H2 header

  A link example:
  [Facebook](http://facebook.com/).

  This is an example of inline \`code\` .

      This is a code block.

  * List item

  >This is a block quote.

  ![Cadillac Escalade image](https://assets.gm.com/cadillac/2020/escalade-colorizer/static/media/06-6C15706-1SA-GBA.5e8a830b.png "Cadillac Escalade.")

  __Bolded text__
`;

const Container = styled.div`
  /* wrapper for the small screen */
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

const Editor = styled.div`
  display: flex; /* for layout of the editor pane */
  flex-direction: column;
  height: 100%;
  font-family: MonoSpace;
  font-size: 1rem;
  font-family: serif;
  color: white;

  @media (max-width: ${SMALL_SCREEN}px) {
    background-color: #444;
    flex: 1 1 50%;
  }
`;

const Label = styled.label`
  display: flex; /* for placement of the label */
  flex-direction: column;
  background-color: #181818;
  color: #ddd;
  text-transform: uppercase;
  justify-content: center;
  padding: 0.75rem;
  flex: 0 0 2.5rem;

  @media (max-width: ${SMALL_SCREEN}px) {
    background-color: #444;
  }
`;

const Output = styled.div.attrs({
  id: "preview"
})`
  margin: 10px;
  height: 100%;
`;

const Preview = styled.div`
  color: black;
  overflow-x: hidden;
  overflow-y: auto;
  user-select: none;
  flex: 1 1;

  @media (max-width: ${SMALL_SCREEN}px) {
    flex: 1 1 50%;
  }
`;

const Resizer = styled.div`
  background-color: #303030;
  flex: 0 0 0.5rem;
`;

const Text = styled.textarea.attrs({
  id: "editor",
  spellCheck: "false"
})`
  background-color: #232323;
  border: none;
  color: #00ff00;
  caret-color: white;
  outline: none;
  font: 15px/1.5 Monoco, MonoSpace; // font-size / line-height font-family
  padding: 0.5rem;
  resize: none; // disables resizing
  overflow-y: auto;
  flex: 1 1 50%;

  ::selection {
    background-color: rgba(243, 208, 68, 0.19);
  }

  @media (max-width: ${SMALL_SCREEN}px) {
    background-color: #181818;
  }
`;

class App extends React.Component {
  state = {
    markdown: defaultText,
    width: window.innerWidth
  };

  componentWillMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizechange);
  }

  handleChange = event => {
    const value = event.target.value;
    this.setState({
      markdown: value
    });
  };

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  convertMarkupToHTML() {
    /* Note:
      __html and dangerouslySetInnerHTML are React specific
      see: https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
    */
    return { __html: marked(this.state.markdown) };
  }

  render() {
    const { width } = this.state;
    const smallScreen = width <= SMALL_SCREEN;
    const EDITOR_MINIMUM = 162;

    if (smallScreen) {
      return (
        <Container>
          <Editor>
            <Label>Markdown</Label>
            <Text value={this.state.markdown} onChange={this.handleChange} />
          </Editor>
          <Resizer />
          <Preview>
            <Output dangerouslySetInnerHTML={this.convertMarkupToHTML()} />
          </Preview>
        </Container>
      );
    } else {
      return (
        <SplitterLayout primaryMinSize={EDITOR_MINIMUM}>
          <Editor>
            <Label>Markdown</Label>
            <Text value={this.state.markdown} onChange={this.handleChange} />
          </Editor>
          <Preview>
            <Output dangerouslySetInnerHTML={this.convertMarkupToHTML()} />
          </Preview>
        </SplitterLayout>
      );
    }
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
