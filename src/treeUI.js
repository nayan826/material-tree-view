import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";
import { withStyles } from "@material-ui/core/styles";

const StyledTreeItem = withStyles(theme => ({
  root: {
    "&:focus > $content": {
      borderLeft: "4px solid rgb(255, 115, 33)",
      backgroundColor: "rgb(242, 242, 242)"
    }
  },
  iconContainer: {
    "& .close": {
      opacity: 0.3
    }
  },
  group: {
    marginLeft: 12,
    paddingLeft: 12
  },
  label: {
    fontWeight: 300
  },
  content: {
    borderBottom: "1px solid #00000014",
    paddingTop: "10px",
    paddingRight: "10px",
    paddingBottom: "10px",
    paddingLeft: "10px",
    cursor: "pointer",
    marginBottom: 0,
    marginTop: 0,
    whiteSpace: "nowrap"
  }
}))(props => <TreeItem {...props} />);

var treeUi;
export const TreeFactor = (data) => {
  treeUi = data.map(object => {
    return (
      <StyledTreeItem
        key={object.key}
        nodeId={object.key}
        label={object.label}
      >
        {typeof object.nodes === "object" ? TreeFactor(object.nodes) : null}
      </StyledTreeItem>
    );
  });
  return treeUi;
};
