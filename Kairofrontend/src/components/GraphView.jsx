/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';

const GraphView = ({ notes, onNoteSelect }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: container.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!notes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    // Create zoom behavior
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    const g = svg.append("g");

    // Extract links from note content
    const links = [];
    const linkRegex = /\[\[([^\]]+)\]\]/g;

    notes.forEach(note => {
      if (note.content) {
        let match;
        while ((match = linkRegex.exec(note.content)) !== null) {
          const targetTitle = match[1];
          const targetNote = notes.find(n => 
            n.title?.toLowerCase() === targetTitle.toLowerCase()
          );
          if (targetNote) {
            links.push({
              source: note.noteId,
              target: targetNote.noteId,
              value: 1
            });
          }
        }
      }
    });

    // Prepare nodes data
    const nodes = notes.map(note => ({
      id: note.noteId,
      title: note.title || 'Untitled',
      content: note.content || '',
      isStarred: note.isStarred,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      size: Math.max(10, Math.min(30, (note.content?.length || 0) / 50)),
      linkCount: links.filter(l => l.source === note.noteId || l.target === note.noteId).length
    }));

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.size + 5));

    // Create arrow markers
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "currentColor")
      .style("stroke", "none")
      .attr("class", "text-obsidian-400");

    // Create links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", "currentColor")
      .style("stroke-opacity", 0.3)
      .style("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    // Create nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles to nodes
    node.append("circle")
      .attr("r", d => d.size)
      .style("fill", d => d.isStarred ? "#f59e0b" : "#3b82f6")
      .style("stroke", "currentColor")
      .style("stroke-width", d => selectedNode?.id === d.id ? 3 : 1)
      .style("stroke-opacity", 0.6);

    // Add labels to nodes
    node.append("text")
      .text(d => d.title.length > 15 ? d.title.substring(0, 15) + "..." : d.title)
      .style("font-size", "12px")
      .style("text-anchor", "middle")
      .style("dominant-baseline", "central")
      .style("pointer-events", "none")
      .style("fill", "currentColor")
      .attr("dy", d => d.size + 15);

    // Add hover effects
    node
      .on("mouseover", function(event, d) {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", d.size * 1.2)
          .style("stroke-width", 2);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", d.size)
          .style("stroke-width", selectedNode?.id === d.id ? 3 : 1);
      })
      .on("click", function(event, d) {
        setSelectedNode(d);
        
        // Update visual selection
        node.select("circle")
          .style("stroke-width", 1);
        
        d3.select(this).select("circle")
          .style("stroke-width", 3);
        
        // Call the onNoteSelect callback
        const note = notes.find(n => n.noteId === d.id);
        if (note && onNoteSelect) {
          onNoteSelect(note);
        }
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };

  }, [notes, dimensions, selectedNode]);

  const handleZoom = (direction) => {
    const svg = d3.select(svgRef.current);
    const zoomBehavior = svg.property("__zoom");
    
    if (direction === 'in') {
      svg.transition().call(zoomBehavior.scaleBy, 1.5);
    } else {
      svg.transition().call(zoomBehavior.scaleBy, 1 / 1.5);
    }
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    const zoomBehavior = svg.property("__zoom");
    svg.transition().call(zoomBehavior.transform, d3.zoomIdentity);
  };

  const handleCenter = () => {
    const svg = d3.select(svgRef.current);
    const zoomBehavior = svg.property("__zoom");
    const { width, height } = dimensions;
    svg.transition().call(
      zoomBehavior.transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(1)
    );
  };

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-obsidian-50 dark:bg-obsidian-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-obsidian-200 dark:bg-obsidian-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-obsidian-500" />
          </div>
          <h3 className="text-lg font-semibold text-obsidian-600 dark:text-obsidian-300 mb-2">
            No Graph Data
          </h3>
          <p className="text-obsidian-500">Create some notes with links to see the graph visualization</p>
          <p className="text-sm text-obsidian-400 mt-2">
            Use [[Note Title]] syntax to link notes together
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-obsidian-900">
      {/* Header */}
      <div className="border-b border-obsidian-200 dark:border-obsidian-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Graph View</h2>
            <p className="text-sm text-obsidian-500 mt-1">
              {notes.length} notes • {notes.filter(n => n.content?.includes('[[')).length} with links
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleZoom('out')}
              className="p-2 rounded-lg hover:bg-obsidian-100 dark:hover:bg-obsidian-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('in')}
              className="p-2 rounded-lg hover:bg-obsidian-100 dark:hover:bg-obsidian-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleCenter}
              className="p-2 rounded-lg hover:bg-obsidian-100 dark:hover:bg-obsidian-800 transition-colors"
              title="Center Graph"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-obsidian-100 dark:hover:bg-obsidian-800 transition-colors"
              title="Reset View"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <div className="text-sm text-obsidian-500 ml-4">
              Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="text-obsidian-600 dark:text-obsidian-400"
        />

        {/* Selected Node Info */}
        {selectedNode && (
          <div className="absolute top-4 left-4 bg-white dark:bg-obsidian-800 border border-obsidian-200 dark:border-obsidian-700 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm">{selectedNode.title}</h3>
              {selectedNode.isStarred && (
                <div className="w-4 h-4 text-yellow-500 ml-2">★</div>
              )}
            </div>
            <p className="text-xs text-obsidian-600 dark:text-obsidian-400 mb-2">
              {selectedNode.content.length > 100 
                ? selectedNode.content.substring(0, 100) + "..."
                : selectedNode.content || "No content"
              }
            </p>
            <div className="flex items-center justify-between text-xs text-obsidian-500">
              <span>{selectedNode.linkCount} connections</span>
              <span>{selectedNode.content.length} chars</span>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white dark:bg-obsidian-800 border border-obsidian-200 dark:border-obsidian-700 rounded-lg shadow-lg p-3">
          <h4 className="text-xs font-semibold mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Regular Notes</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Starred Notes</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-obsidian-400 mr-2"></div>
              <span>Links</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-obsidian-200 dark:border-obsidian-600">
            <p className="text-xs text-obsidian-500">
              Drag nodes • Click to select • Scroll to zoom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphView;