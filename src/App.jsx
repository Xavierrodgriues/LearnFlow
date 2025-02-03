import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 250, y: 5 }, data: { label: "1" } }
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [connectionStart, setConnectionStart] = useState(null);

  // Track the node where connection starts
  const onConnectStart = (_, { nodeId }) => {
    setConnectionStart(nodeId);
  };

  // When clicking on the pane, create a new node and connect it
  const onPaneClick = (event) => {
    if (!connectionStart) return;

    const reactFlowBounds = event.target.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNodeId = `node-${nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      position,
      data: { label: newNodeId },
    };

    setNodes((nds) => [...nds, newNode]);

    const newEdge = {
      id: `e-${connectionStart}-${newNodeId}`,
      source: connectionStart,
      target: newNodeId,
    };

    setEdges((eds) => [...eds, newEdge]);

    setConnectionStart(null);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onPaneClick={onPaneClick} // Now listens for clicks to create new nodes!
      />
    </div>
  );
}

export default App;
