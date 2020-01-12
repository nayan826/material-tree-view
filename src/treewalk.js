import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import _ from "lodash";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { data } from "./treedata.js";

const useStyles = {
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400
  }
};

class TreeWalk extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: [], filterArray: [], expandStatus: false };
  }

  render() {
    const { classes } = this.props;
    const { expanded, filterArray, expandStatus } = this.state;

    var treeUi;
    const treefactor = data => {
      treeUi = data.map(object => {
        return (
          <TreeItem key={object.key} nodeId={object.key} label={object.label}>
            {typeof object.nodes === "object" ? treefactor(object.nodes) : null}
          </TreeItem>
        );
      });
      return treeUi;
    };

    let keyArray = [];
    const ExapansionArray = data => {
      if (data === undefined) {
        return null;
      }
      Object.keys(data).forEach(element => {
        if (data[element] === undefined) {
          return null;
        }
        keyArray.push(data[element].key);
        if (typeof data[element] === "object") {
          ExapansionArray(data[element].nodes);
        }
      });
      return keyArray;
    };

    let differnece = [];
    let keyValue = [];
    const filteredData = (data, searchString) => {
      if (data === undefined) {
        return null;
      }
      Object.keys(data).forEach(element => {
        if (data[element] === undefined) {
          return null;
        }
        differnece.push({
          key: data[element].key,
          level: data[element].level,
          parentKey: data[element].parentKey,
          label: data[element].label
        });
        if (data[element].label === searchString) {
          keyValue.push({
            key: data[element].key,
            level: data[element].level,
            parentKey: data[element].parentKey,
            label: data[element].label
          });
        }
        if (typeof data[element] === "object") {
          filteredData(data[element].nodes, searchString);
        }
      });
      return keyValue;
    };

    let expandedList = [];
    let reversedData = [];

    const createIndex = (data, searchString) => {
      let pairs = filteredData(data, searchString);
      _.forEachRight(differnece, value => {
        reversedData.push(value);
      });

      pairs.forEach(object => {
        let currentLevel = object.level - 1;
        let currentKey = object.parentKey;

        reversedData.forEach(items => {
          if (items.key === currentKey && items.level === currentLevel) {
            expandedList.push(items);
            currentKey = items.parentKey;
            currentLevel--;
          } else if (items.parentKey === "root") {
            expandedList.push(items);
          }
        });
      });
      return _.uniqWith(expandedList, _.isEqual);
    };

    const handleChange = event => {
      let searchString = event.target.value;
      if (searchString.length !== 0) {
        let searchExpansion = createIndex(data, searchString);
        let expansionKey = searchExpansion.map(object => object.key);
        this.setState({
          filterArray: _.uniqWith(expansionKey, _.isEqual),
          expandStatus: true
        });
      }
      event.preventDefault();
    };

    const handleExpand = (event) => {
      let expansionKey = ExapansionArray(data);
      this.setState({
        filterArray: _.uniqWith(expansionKey, _.isEqual),
        expandStatus: true
      });
      event.preventDefault();
    };

    const handleCollapse = (event) => {
      this.setState({ filterArray: [], expanded : [] });
      event.preventDefault();
    };

    const nodeToogle = (event, nodes) => {
      this.setState({ expanded: nodes, expandStatus: false });
      event.preventDefault();
    };

    return (
      <>
        <input onChange={handleChange} placeholder="Type  & Search" />
        <button onClick={handleExpand}>Expand</button>
        <button onClick={handleCollapse}>Collapse</button>
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeToggle={nodeToogle}
          {...(expandStatus === true
            ? { expanded: filterArray }
            : { expanded: expanded })}
        >
          {treefactor(data)}
        </TreeView>
      </>
    );
  }
}

export default withStyles(useStyles)(TreeWalk);
