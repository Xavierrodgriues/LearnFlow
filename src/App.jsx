import React, { useState } from "react";
import  {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Controls,
  Background
} from "@xyflow/react";
import { Resizable } from "react-resizable";  // Install react-resizable for resizing nodes
import "@xyflow/react/dist/style.css";
import "react-resizable/css/styles.css";

const initialNodes = [
  {
    id: "1",
    position: { x: 250, y: 5 },
    data: { label: "Hello" },
    style: { width: 150, height: 80 },
    resizable: true,
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function CustomNode({ id, data }) {
  return (
    <Resizable
      width={150}
      height={80}
      minConstraints={[120, 80]}
      maxConstraints={[300, 200]}
    >
      <div
        style={{
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        {data.label}
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </Resizable>
  );
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [connectionStart, setConnectionStart] = useState(null);

  const onConnectStart = (_, { nodeId }) => {
    setConnectionStart(nodeId);
  };

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
      style: { width: 150, height: 80 },
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
        onPaneClick={onPaneClick}
        nodeTypes={{ custom: CustomNode }}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default App;
