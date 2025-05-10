import React from 'react';
import { OrganizationNode } from '../../../shared/types';
import EmployeeCard from '../employees/EmployeeCard';
import { Tree, TreeNode } from 'react-organizational-chart';

interface CustomOrgChartProps {
  data: OrganizationNode[];
  title?: string; // Make title optional since we'll remove it from the component
}



const CustomOrgChart: React.FC<CustomOrgChartProps> = ({ data }) => {
  // Node component with EmployeeCard
  const NodeContent = ({ node }: { node: OrganizationNode }) => (
    <div className="inline-block rounded-lg p-1.5 m-0.5">
      <EmployeeCard employee={node} />
    </div>
  );

  // Recursive function to render the tree nodes
  const renderTreeNodes = (node: OrganizationNode): React.ReactElement => {
    return (
      <TreeNode key={node.id} label={<NodeContent node={node} />}>
        {node.subordinates.map((subordinate) => renderTreeNodes(subordinate))}
      </TreeNode>
    );
  };

  // For multiple root nodes, we need an invisible root
  const renderTree = () => {
    if (data.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          No organization data available
        </div>
      );
    }
    
    if (data.length === 1) {
      // If there's only one root node, use it directly
      return (
        <Tree
          lineWidth={'2px'}
          lineColor={'#14b8a6'} // Teal color to match the cards
          lineBorderRadius={'10px'}
          label={<NodeContent node={data[0]} />}
        >
          {data[0].subordinates.map((subordinate) => renderTreeNodes(subordinate))}
        </Tree>
      );
    }
    
    // For multiple root nodes, create an invisible root
    return (
      <Tree
        lineWidth={'2px'}
        lineColor={'#14b8a6'}
        lineBorderRadius={'10px'}
        label={
          <div className="invisible h-1">Root</div>
        }
      >
        {data.map((node) => renderTreeNodes(node))}
      </Tree>
    );
  };

  return (
    <div className="org-chart-container">
      <div className="px-5 py-6 overflow-x-auto">
        {renderTree()}
      </div>
      
      {/* Custom styles for the organizational chart */}
      <style jsx global>{`
        .oc-tree {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        
        .oc-node {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .oc-h-line {
          height: 2px !important;
        }
        
        .oc-v-line {
          width: 2px !important;
        }
        
        .oc-line {
          height: 25px !important;
        }
      `}</style>
    </div>
  );
};

export default CustomOrgChart;
