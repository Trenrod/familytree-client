import { SimulationNodeDatum } from 'd3';
import PersonEntry from './PersonEntry';

export interface TreeGraphNodeDataSimulation extends SimulationNodeDatum, TreeGraphNodeData {}

export interface TreeGraphNodeData{
  id: number;
  data: PersonEntry[];
}

export interface TreeGraphLinkData {
  index?: number;
  source: number | TreeGraphNodeDataSimulation;
  target: number | TreeGraphNodeDataSimulation;
}

export interface TreeGraphData {
  nodes: TreeGraphNodeData[];
  links: TreeGraphLinkData[];
}
