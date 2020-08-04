import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Button } from 'react-bootstrap';
import { BsList,BsLockFill } from 'react-icons/bs';

const available = [
  { id: "start time", name: "Start Time" },
  { id: "stop time", name: "Stop Time" },
  { id: "per point", name: "Per Point" },
  { id: "initial margin" , name: "Initial Margin" },
];

const visible = [
  { id: "change %", name: "Change %"},
  { id: "change", name: "Change"},
  { id: "last", name: "Last" },
  { id: "last volume", name: "Last Volume" },
];

const fixed = [
  { id: "symbol &amp; description", name: "Symbol & Description"},
];

const columnsFromBackend = {
  "available": {
    name: "Available",
    items: available
  },
  "visible": {
    name: "Visible",
    items: fixed.concat(visible)
  },
};

const checkDisable=(item)=>{
  for(let i=0;i<fixed.length;i++){
    if(fixed[i].id===item.id){
      return true;
    }
  }
  return false;
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      columns: columnsFromBackend,
      fixed: fixed,
    }
    this.baseState = this.state;
  }

  //save data when click on save
  saveData=(event)=>{
    this.baseState = this.state;
    //currently only log the state to console.
    console.log(this.state);
  }

  //reset all moved when click on cancel
  resetData=()=>{
    this.setState(this.baseState);
  }

  //Double click event
  onDoubleClick=(event)=>{
    const name = event.target.innerHTML;
    const id = name.toLowerCase();
    const newFixed = {id:id,name:name};
    console.log(newFixed)
    let index = -1;
    for(let i=0;i<this.state.fixed.length;i++){
      if(this.state.fixed[i].id===newFixed.id){
        index = i;
        this.setState(prev=>{
          const list = prev.fixed.splice(index,1);
          return{
            list
          }
        });
        break;
      }
    }
    if(index===-1){
      this.setState(prev=>{
        const list = prev.fixed.push(newFixed);
        return{
          list
        }
      });
    }   
  }

  //Drag event
  onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      this.setState(prev=>{
        let sourceColumn = prev.columns[source.droppableId];
        let destColumn = prev.columns[destination.droppableId];
        let sourceItems = [...sourceColumn.items];
        let destItems = [...destColumn.items];
        let [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        return{
          columns:{
            ...prev.columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems
            }
          }
        }
      });
    } else {
      this.setState(prev=>{   
        let column = prev.columns[source.droppableId];
        let copiedItems = [...column.items];
        let [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        console.log(prev.columns)
        console.log(copiedItems);
        console.log(column);
        return{
          columns:{
            ...prev.columns,
            [source.droppableId]: {
              ...column,
              items: copiedItems
            }
          }
        }
      },()=>{
        
      });
    }
  };

  render(){
    return (
      <div>
        <div style={{ background:"#000000", display:"flex", height: "100%", color:"#ffffff", paddingTop:"20px", paddingLeft:"20px"}}>
          <h5>Configure Data Fields</h5>
        </div>
        <div style={{ background:"#000000", display:"flex", height: "100%", color:"#9da4ab",paddingLeft:"20px"}}>
          <span>Drag & Drop between columns to configure visible data.</span>
        </div>
        <div style={{ background:"#000000",display: "flex", height: "100%", padding:"20px" }}>
          <DragDropContext style={{color:"white"}} onDragEnd={result => this.onDragEnd(result)}>
            {Object.entries(this.state.columns).map(([columnId, column]) => {
              return (   
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    
                  }}
                  key={columnId}
                  onDoubleClick={event=>this.onDoubleClick(event)}
                >
                  <p style={{color:'#9da4ab',paddingLeft:"15px",marginTop:"20px"}}>{column.name}</p>
                  <div>
                    <Droppable droppableId={columnId} key={columnId} >
                      {(provided) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: "#000000",
                              padding: 3,
                              width: 300,
                              borderStyle: column.name==="Available"
                                ? "none none none none"
                                : "none none none dashed",
                              borderWidth:"3px",
                            }}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                  isDragDisabled={checkDisable(item)}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{                                     
                                          userSelect: "none",
                                          padding: 5,
                                          margin: "0 0 5px 5px",
                                          minHeight: "20px",
                                          backgroundColor: snapshot.isDragging
                                            ? "#252930"
                                            : "#000000",
                                          color: checkDisable(item)
                                            ? "#9da4ab"
                                            : "#ffffff",
                                          ...provided.draggableProps.style
                                        }}
                                      >
                                        <div>
                                          <div style={{padding:"10px",float:"left"}}>
                                            <BsLockFill style={{
                                              display: checkDisable(item)
                                              ? "block"
                                              : "none",
                                              }}
                                            />
                                            <BsList style={{
                                              display: checkDisable(item)
                                              ? "none"
                                              : "block",
                                              }}
                                            />
                                          </div>
                                          <div style={{padding:"7px"}}>
                                            {item.name}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        </div>
        <div style={{background:"#000000" , height:"1000px", padding:"20px"}}>
          <Button style={{margin:"10px", width:"90px"}} variant="info" onClick={event=>this.saveData(event)}>Save</Button>
          <Button style={{margin:"10px", width:"90px"}} variant="secondary" onClick={event=>this.resetData(event)}>Cancel</Button>
        </div>
      </div>
    );
  }
}

export default App;
