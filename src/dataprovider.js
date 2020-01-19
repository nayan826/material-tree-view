import React from "react";
import {flatTree} from "./flatTree";
import TreeWalk from "./treewalk"
import FlatToNested from 'flat-to-nested';
import {data} from "./treedata"

class Provider extends React.Component {
    constructor(props) {
        super(props);
        this.flatToNested = new FlatToNested({ id: "key", parent: "parentKey", children: "nodes",options : {deleteParent : false }});      
        this.state = {equipmentList : []}
    }

    componentDidMount(){
        const equipment = flatTree.map(item =>({
            key: item.revision_uid,
            parentKey: item.parent_revision_uid,
            label: item.ico_class_name,
            level: item.bomline_level,
            customer_tag: item.customer_tag,
            description: item.description,
            item_id: item.item_id,
            yard_tag: item.yard_tag,
            wartsila_tag: item.wartsila_tag,
            item_revision_id: item.item_revision_id,
            bomline_uid: item.bomline_uid,
            object_type: item.object_type
        }
          ));
          this.flatToNested.convert(equipment)
          this.setState({
              equipmentList : data
          })
    }

searchexpansion = (searchExpansion) => {  
    var rootData = [];  
    this.flatToNested.convert(searchExpansion)
     searchExpansion.forEach((item,index) => {
      if(item.parentKey === "root"){
       rootData  = searchExpansion[index]
      }
    }) 
    this.setState({
        equipmentList: [rootData]
   }); 
}

    render() { 
        return ( 
            <>
            <TreeWalk nestedData = {this.state.equipmentList} searchexpansion = {this.searchexpansion} />
            </>
         );
    }
}
 
export default Provider;
