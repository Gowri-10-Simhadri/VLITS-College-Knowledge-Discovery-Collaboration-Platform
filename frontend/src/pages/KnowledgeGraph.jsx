import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Network, Filter, Search, ZoomIn, ZoomOut, RotateCcw, 
  Layers, ExternalLink, X, Info, Sparkles, Database, 
  GraduationCap, Cpu, CheckCircle2 
} from 'lucide-react';
import { api } from '../api/client';

export default function KnowledgeGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const nodeTypes = ['All', 'Project', 'Skill', 'Technology', 'Faculty', 'Student', 'Dataset'];

  const typeColorMap = {
    Project: '#6366f1',    // Indigo
    Skill: '#10b981',      // Emerald
    Technology: '#fb923c', // Orange
    Faculty: '#f59e0b',    // Amber
    Student: '#06b6d4',    // Cyan
    Dataset: '#f43f5e',    // Rose
    ResearchPaper: '#8b5cf6' // Violet
  };

  useEffect(() => {
    async function loadGraph() {
      try {
        const res = await api.get('/graph');
        const nodesWithCoords = res.data.nodes.map((node, i) => {
          const angle = (i / res.data.nodes.length) * 2 * Math.PI;
          const radius = 220 + (i % 3) * 120;
          return {
            ...node,
            x: 500 + radius * Math.cos(angle) + (Math.random() - 0.5) * 40,
            y: 350 + radius * Math.sin(angle) + (Math.random() - 0.5) * 40
          };
        });
        setGraphData({ nodes: nodesWithCoords, links: res.data.links });
        setFilteredNodes(nodesWithCoords);
      } catch (err) {
        console.error('Failed to load graph:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, []);

  // Filter nodes
  useEffect(() => {
    let result = graphData.nodes;
    if (selectedType !== 'All') {
      result = result.filter(n => n.type === selectedType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => n.name.toLowerCase().includes(q));
    }
    setFilteredNodes(result);
  }, [selectedType, searchQuery, graphData]);

  // Pan controls
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  // Connected links for selected node
  const selectedNodeLinks = selectedNode 
    ? graphData.links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      
      {/* Header Banner */}
      <div className="glass-card p-5 border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <Network className="w-4 h-4" />
            <span>Interactive College Knowledge Graph Explorer</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            College Knowledge Topology
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore how projects, skills, faculty, datasets, and students interconnect across graduating classes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {nodeTypes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedType === t
                  ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="glass-card border-white/15 relative overflow-hidden rounded-2xl h-[550px] sm:h-[650px] shadow-2xl bg-dark-950/90">
        
        {/* Canvas Controls Overlay */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          {/* Quick Search inside Graph */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search node concept..."
              className="pl-8 pr-3 py-1.5 glass-input text-xs w-48 sm:w-60 bg-dark-900/90"
            />
          </div>

          <div className="flex items-center gap-1 glass-panel p-1 rounded-xl border-white/10">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 2.5))}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.4))}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 glass-panel p-2.5 rounded-xl border-white/10 hidden sm:flex items-center gap-3 text-[11px] font-medium text-slate-300">
          {Object.entries(typeColorMap).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span>{type}</span>
            </div>
          ))}
        </div>

        {/* SVG Graph Canvas */}
        <svg
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <rect width="100%" height="100%" fill="transparent" />
          
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Draw Links */}
            {graphData.links.map((link, idx) => {
              const sourceNode = graphData.nodes.find(n => n.id === link.source);
              const targetNode = graphData.nodes.find(n => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted = selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);

              return (
                <line
                  key={idx}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? '#22d3ee' : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={isHighlighted ? 2.5 : 1}
                  strokeDasharray={link.relationship === 'REQUIRES_SKILL' ? '4 3' : 'none'}
                />
              );
            })}

            {/* Draw Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const nodeColor = typeColorMap[node.type] || '#6366f1';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Glow */}
                  {isSelected && (
                    <circle
                      r={node.type === 'Project' ? 36 : 28}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      className="animate-ping opacity-50"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={node.type === 'Project' ? 22 : 16}
                    fill={nodeColor}
                    stroke={isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-transform group-hover:scale-125 duration-200"
                    style={{
                      filter: `drop-shadow(0 0 10px ${nodeColor}80)`
                    }}
                  />

                  {/* Label */}
                  <text
                    y={node.type === 'Project' ? 34 : 26}
                    textAnchor="middle"
                    fill="#f1f5f9"
                    fontSize={node.type === 'Project' ? '11px' : '9.5px'}
                    fontWeight="600"
                    className="pointer-events-none drop-shadow-md select-none"
                  >
                    {node.name.length > 20 ? `${node.name.slice(0, 18)}...` : node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Node Inspector Drawer (Slide-out on click) */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bottom-4 w-80 sm:w-96 glass-panel rounded-2xl border border-cyan-500/40 p-5 shadow-2xl z-30 flex flex-col justify-between animate-in slide-in-from-right duration-200 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span 
                    className="glass-badge text-[11px] font-bold"
                    style={{ 
                      backgroundColor: `${typeColorMap[selectedNode.type]}25`,
                      color: typeColorMap[selectedNode.type],
                      borderColor: `${typeColorMap[selectedNode.type]}50`
                    }}
                  >
                    {selectedNode.type} Node
                  </span>
                  <h3 className="font-extrabold text-base text-white mt-2 leading-snug">
                    {selectedNode.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedNode.domain && (
                <p className="text-xs text-slate-300">
                  Domain: <strong className="text-cyan-300">{selectedNode.domain}</strong>
                </p>
              )}

              {/* Connected Relationships List */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-bold text-slate-300 block">Connected Knowledge ({selectedNodeLinks.length}):</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedNodeLinks.map((link, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white/[0.04] border border-white/5 text-[11px] flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-[10px]">{link.relationship}</span>
                      <span className="text-slate-200 font-medium truncate max-w-[140px]">
                        {link.source === selectedNode.id ? link.targetName : link.sourceName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons if Project */}
            {selectedNode.type === 'Project' && (
              <div className="pt-4 border-t border-white/10">
                <Link
                  to={`/projects/${selectedNode.id}`}
                  className="btn-gradient w-full !py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span>Open Full Capstone Memory</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
