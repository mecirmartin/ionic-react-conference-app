import * as t from "@babel/types";

const customPlugin = () => {
  return {
    visitor: {
      Program(programPath: any, state: any) {
        // Get user configs
        const {
          customProperty = "className",
          slashChar = "/",
          dirLevel = 1,
        } = state.opts;
        const filename = state.file.opts.filename;

        const splits = filename.split(slashChar);
        if (!splits || !splits.length) {
          console.error(
            "babel-plugin-react-generate-property plugin error: File path is not valid. If you are on Windows, you might need to specify backslash as slashChar in options."
          );
          return;
        }

        const dirNames = splits.slice(-1 - dirLevel, -1);

        const fileName = splits[splits.length - 1].split(".")[0];
        const fileIdentifier = `${dirNames.join("_")}_${fileName}`;

        programPath.traverse({
          JSXElement(jsxPath: any) {
            let nodeName = "",
              dataIDDefined = false;

            let start: number = 0;
            let end: number = 0;

            // Traverse once to get the element node name (div, Header, span, etc)
            jsxPath.traverse({
              JSXOpeningElement(openingPath: any) {
                openingPath.stop(); // Do not visit child nodes again
                const identifierNode = openingPath.get("name").node;
                nodeName = identifierNode.name;

                if (!openingPath.parent.children.length) {
                  // Node has no children, it starts and ends on same line
                  start = openingPath.parent.openingElement.loc.start.line;
                  end = start;
                } else {
                  // If node has multiple children, code starts at first childs, ends at last
                  start = openingPath.parent.children[0].loc.start.line;
                  end =
                    openingPath.parent.children[
                      openingPath.parent.children.length - 1
                    ].loc.end.line;
                }
                openingPath.traverse({
                  JSXAttribute(attributePath: any) {
                    // If the data attribute doesn't exist, then we append the data attribute
                    const attributeName = attributePath.get("name").node.name;
                    if (!dataIDDefined) {
                      dataIDDefined = attributeName === customProperty;
                    }
                  },
                });
              },
            });

            if (!dataIDDefined && nodeName && nodeName !== "Fragment") {
              jsxPath.node.openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier(customProperty),
                  t.stringLiteral(`B${start}E${end}`)
                )
              );
            }
          },
        });
      },
    },
  };
};

export default customPlugin;
