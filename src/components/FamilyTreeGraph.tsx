import React, { ReactElement, useEffect, useRef} from 'react';
import * as d3 from 'd3';
import { TreeGraphData, TreeGraphLinkData, TreeGraphNodeData, TreeGraphNodeDataSimulation } from '../models/TreeGraphNodeData';
import PersonEntry from '../models/PersonEntry';

const nodeWidth = 200;
const nodeHeight = 200;
const coupleOffset = 40;
// const personTileWidth = 90;
// const personTileHeight = 120;

const personDescTextOffsetY = 0;
const personDescTextOffsetRowY = 15;
const personDescTextOffsetX = 0;

const positionOffset = (amountCouples: number, idx:number, axis: 'x'|'y') => {
    if (amountCouples === 4) {
        if (idx === 0) {
            return axis === 'x'? nodeWidth / 2 - coupleOffset: nodeHeight / 2 - coupleOffset;
        } else if (idx === 1) {
            return axis === 'x' ? nodeWidth / 2 + coupleOffset: nodeHeight / 2 + coupleOffset;
        } else if (idx === 2) {
            return axis === 'x'? nodeWidth / 2 - coupleOffset: nodeHeight / 2 + coupleOffset;
        } else {
            return axis === 'x' ?  nodeWidth / 2 + coupleOffset :  nodeHeight / 2 - coupleOffset;
        }
    } else if (amountCouples === 3) {
        if (idx === 0) {
            return axis === 'x' ? nodeWidth / 2 - coupleOffset : nodeHeight / 2 - coupleOffset;
        } else if (idx === 1) {
            return axis === 'x'?  nodeWidth / 2 : nodeHeight / 2 + coupleOffset;
        } else {
            return axis === 'x'?  nodeWidth / 2 + coupleOffset:  nodeHeight / 2 - coupleOffset;
        }
    } else if (amountCouples === 2) {
        if (idx === 0) {
            return axis === 'x'? nodeWidth / 2 - coupleOffset: nodeHeight / 2;
        } else {
            return axis === 'x'? nodeWidth / 2 + coupleOffset : nodeHeight / 2;
        }
    } else if (amountCouples === 1) {
        return axis === 'x'? nodeWidth / 2:  nodeHeight / 2;
    }
};

const drawCircle = (d3Obj: d3.BaseType, data: TreeGraphNodeData, updateDirectRelation: (person:PersonEntry)=>void) => {
    d3.select(d3Obj).selectAll(`.node_${data.id}`)
        .data(data.data)
        .enter()
        .append('circle')
        .attr('class', `person node_${data.id}`)
        .attr('id', (person: PersonEntry) => `person_${person.id}`)
        .attr('r', 50)
        .attr('stroke', 'black')
        .attr('stroke-width', '1')
        .attr('fill', '#FFFFFF')
        .on('mouseover', (_, person:PersonEntry) => { 
            updateDirectRelation(person);
        })
        .attr('cx', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'x'))
        .attr('cy', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'y'));
};

const writeText = (d3Obj: d3.BaseType, data: TreeGraphNodeData, attribute: string, row: number) => {
    d3.select(d3Obj).selectAll(`.text_${data.id}_${row}`)
        .data(data.data)
        .enter()
        .append('text')
        .text((person: PersonEntry) => person[attribute])
        .attr('class', `text text_${data.id}_${row}`)
        .attr('id', (person: PersonEntry) => `text_${person.id}_${row}`)
        .attr('font-size', '12px')
        .attr('text-anchor', 'middle')
        .attr('x', (person: PersonEntry, idx: number) =>positionOffset(data.data.length, idx, 'x'))
        .attr('y', (person: PersonEntry, idx: number) =>positionOffset(data.data.length, idx, 'y'))
        .attr(
            'transform',
            `translate(${personDescTextOffsetX},${personDescTextOffsetY + row * personDescTextOffsetRowY})`,
        );
};

interface FamilyTreeGraphProps {
  width: number;
  height: number;
  data: TreeGraphData;
}

export default function FamilyTreeGraph(props: FamilyTreeGraphProps): ReactElement {
    const ref = useRef<SVGSVGElement>();

    useEffect(() => {
        if (ref.current == null) return;
        d3.select(ref.current)
            .attr('width', props.width)
            .attr('height', props.height)
            .style('border', '1px solid black');
    }, [props.height, props.width]);

    const draw = () => {
        if (ref.current == null) return;
        const svg = d3.select(ref.current);

        let nodes = svg.select('svg').selectAll('circle');
        svg.exit().remove();//remove unneeded circles

        // Initialize the links
        const link = svg
            .selectAll('line')
            .data(props.data.links)
            .enter()
            .append('line')
            .style('stroke', '#aaa');

        const updateRelation = (personParam: PersonEntry) => {
            props.data.nodes = props.data.nodes.map<TreeGraphNodeData>((nodeData: TreeGraphNodeData) => {
                nodeData.data = nodeData.data.map<PersonEntry>((person: PersonEntry) => {
                    if (person.id === personParam.id) person.markers.isDirectRelation = 'self';
                    else if (person.fatherId === personParam.id) person.markers.isDirectRelation = 'child';
                    else if (person.motherId === personParam.id) person.markers.isDirectRelation = 'child';
                    else if (person.id === personParam.fatherId) person.markers.isDirectRelation = 'parent';
                    else if (person.id === personParam.motherId) person.markers.isDirectRelation = 'parent';
                    else person.markers.isDirectRelation = null;
                    return person;
                });
                return nodeData;
            });
            svg
                .selectAll('svg')
                .data<TreeGraphNodeData>(props.data.nodes)
                .each(function (d: TreeGraphNodeData) {
                    d3.select(this).selectAll(`.node_${d.id}`)
                        .data(d.data)
                        .attr('fill', (person: PersonEntry) =>  {
                            if (person.markers.isDirectRelation === 'self') return '#FFCCCC';
                            else if (person.markers.isDirectRelation === 'parent') return '#CCFFCC';
                            else if (person.markers.isDirectRelation === 'child') return '#CCCCFF';
                            else return '#FFFFFF';
                        });
                });
        };

        // Initialize the nodes
        nodes = svg
            .selectAll('svg')
            .data<TreeGraphNodeData>(props.data.nodes)
            .enter()
            .append('svg')
            .each(function (d: TreeGraphNodeData) {
                console.log('Trigger update items');
                drawCircle(this, d, updateRelation);
                writeText(this, d, 'forename', 0);
                writeText(this, d, 'lastname', 1);
                writeText(this, d, 'birthName', 2);
                writeText(this, d, 'birthdate', 3);
            });

        const nodeAttr = nodes;

        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            link
                .attr('x1', (d: TreeGraphLinkData) => (d.source as TreeGraphNodeDataSimulation).x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);
            link.exit().remove();

            nodeAttr
                .attr('x', (d: any) => d.x - nodeHeight / 2)
                .attr('y', (d: any) => d.y - nodeWidth / 2)
                .attr('width', nodeWidth)
                .attr('height', nodeHeight);
            nodeAttr.exit().remove();
        }

        // Let's list the force we wanna apply on the network
        // const simulation = d3.forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
        d3.forceSimulation(props.data.nodes as TreeGraphNodeDataSimulation[]) // Forcealgorithm is applied to data.nodes
            .force('link', d3.forceLink().links(props.data.links) // This force provides links between nodes
                .id((d: any) => d.id) // This provide  the id of a node
                .distance(100).strength(1))
            .force('charge', d3.forceManyBody().strength(-5000)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force('center', d3.forceCenter(props.width / 2, props.height / 2)) // This force attracts nodes to the center of the svg area
            .on('tick', ticked);
    };

    useEffect(() => {
        console.log('Triggered draw');
        draw();
    }, [props.data, draw]);

    return (
        <div className="chart">
            <svg ref={ref} />
        </div>
    );
}
