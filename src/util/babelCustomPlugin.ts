import * as t from "@babel/types";

const customPlugin = () => {
  return {
    visitor: {
      ReturnStatement(path: any) {
        path.skip();
      },
      JSXElement(path: any) {
        if (
          path.node.openingElement.name.name !== "span" &&
          path.node.openingElement.name.name !== "IonCol"
        ) {
          const nestedProp =
            (path.parent.openingElement &&
              path.parent.openingElement.name.name) ||
            "";
          if (nestedProp === "span") {
            if (!path.node.children.length) {
              return path.skip();
            }

            return t.traverse(path.node.children[0], customPlugin);
          }

          let start: number;
          let end: number;

          if (!path.node.children.length) {
            // Node has no children, it starts and ends on same line
            start = path.node.openingElement.loc.start.line;
            end = start;
          } else {
            // If node has multiple children, code starts at first childs, ends at last
            start = path.node.children[0].loc.start.line;
            end =
              path.node.children[path.node.children.length - 1].loc.end.line;
          }

          const spanId = t.jsxIdentifier("span");

          path.replaceWith(
            t.jsxElement(
              t.jsxOpeningElement(spanId, [
                t.jsxAttribute(
                  t.jsxIdentifier("data-source-begin"),
                  t.stringLiteral(`${start}`)
                ),
                t.jsxAttribute(
                  t.jsxIdentifier("data-source-end"),
                  t.stringLiteral(`${end}`)
                ),
              ]),
              t.jsxClosingElement(spanId),
              [path.node]
            )
          );
        }
      },
    },
  };
};

export default customPlugin;
