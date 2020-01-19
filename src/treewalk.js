import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import _ from "lodash";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { data } from "./treedata.js";
import {TreeFactor} from "./treeUI"
import {ExapansionArray} from "./treefilter"

const useStyles = {
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400
  }
};
var differnece = [] 
var keyValue = []
var expandedList = [];
var reversedData = [];
class TreeWalk extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: [], filterArray: [], expandStatus: false };
    
  }


 filteredData = (data, searchString) => {
 
  if (data === undefined) {
    return null;
  }
  Object.keys(data).forEach(element => {
    if (data[element] === undefined) {
      return null;
    }
    differnece.push(data[element]);
    if (data[element].label.toLowerCase().includes(searchString.toLowerCase())) {
      
      keyValue.push({
          key: data[element].key,
          level: data[element].level,
          parentKey: data[element].parentKey,
          label: data[element].label
      });
    }
    if (typeof data[element] === "object") {
      this.filteredData(data[element].nodes, searchString);
    }
  });

  return keyValue;
  };

  createIndex = (data, searchString) => {
  
    let pairs = this.filteredData(data, searchString);
 
 
      _.forEachRight(differnece, value => {
        reversedData.push(value);
      });

      pairs.forEach(object => {
        let currentLevel = object.level - 1;
        let currentKey = object.parentKey;
        reversedData.forEach(items => {
          if (items.key === currentKey && items.level === currentLevel) {
            pairs.push({
              key: items.key,
          level: items.level,
          parentKey: items.parentKey,
          label: items.label
            });
            currentKey = items.parentKey;
            currentLevel--;
          } else if (items.parentKey === "root") {
            pairs.push({key: items.key,
              level: items.level,
              parentKey: items.parentKey,
              label: items.label});
          }
        });
      });
    
      return _.uniqWith(pairs, _.isEqual);
  };


  render() {
    const { classes } = this.props;
    const { expanded, filterArray, expandStatus } = this.state;
    var {nestedData, searchexpansion} = this.props 

    ExapansionArray(data)

    const handleChange = event => {
    differnece = [] 
    keyValue = []
    expandedList = [];
    reversedData = [];
      let searchString = event.target.value;
      if (searchString.length !== 0) {
        let searchExpansion = this.createIndex(data, searchString);
        searchexpansion(searchExpansion)
        let expansionKey = ExapansionArray(data);
        this.setState({
          filterArray: _.uniqWith(expansionKey, _.isEqual),
          expandStatus: true
        });
      }
      else{
        this.setState({
          expandStatus: true
        });
        nestedData = data;
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
if(nestedData.length !== 0){
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
          {TreeFactor(nestedData)}
        </TreeView>
      </>
    );
          }
        else{
          return(
            <>
            Loading...
            </>
          )
        }
  }
}

export default withStyles(useStyles)(TreeWalk);