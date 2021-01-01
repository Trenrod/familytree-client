import * as d3 from "d3";
import PersonEntry from "../models/PersonEntry";
import { TreeGraphData, TreeGraphLinkData, TreeGraphNodeData, TreeGraphNodeDataSimulation } from "../models/TreeGraphNodeData";

const nodeWidth = 200;
const nodeHeight = 200;
const coupleOffset = 40;
// const personTileWidth = 90;
// const personTileHeight = 120;

const personDescTextOffsetY = 0;
const personDescTextOffsetRowY = 15;
const personDescTextOffsetX = 0;


const draw = function (ref: React.MutableRefObject<SVGSVGElement>, dataset: TreeGraphData, width: number, height: number) {
    if (ref.current == null) return;

    d3.select("g.parent").selectAll("*").remove();

    let svg = d3.select(ref.current).select('g');
    svg.select('g').selectAll('circle');
    svg.exit().remove();//remove unneeded circles


    const updateRelation = (personParam: PersonEntry) => {
        dataset.nodes = dataset.nodes.map<TreeGraphNodeData>((nodeData: TreeGraphNodeData) => {
            nodeData.data = nodeData.data.map<PersonEntry>((person: PersonEntry) => {
                if (person.id === personParam.id) person.markers.isDirectRelation = 'self';
                else if (personParam.id in personParam.children) person.markers.isDirectRelation = 'child';
                else if (personParam.id in personParam.parents) person.markers.isDirectRelation = 'parent';
                else person.markers.isDirectRelation = null;
                return person;
            });
            return nodeData;
        });
        svg
            .selectAll('svg')
            .each(function (d: TreeGraphNodeData) {
                d3.select(this).selectAll(`.node_${d.id}`)
                    .attr('fill', (person: PersonEntry) => {
                        if (person.markers.isDirectRelation === 'self') return '#FFCCCC';
                        else if (person.markers.isDirectRelation === 'parent') return '#CCFFCC';
                        else if (person.markers.isDirectRelation === 'child') return '#CCCCFF';
                        else return '#FFFFFF';
                    })
            });
    };

    // Initialize the links
    const link = svg
        .selectAll('line')
        .data(dataset.links)
        .enter()
        .insert('line')
        .style('stroke', '#aaa');

    // Initialize the nodes
    const nodes = svg
        .selectAll('svg')
        .data<TreeGraphNodeData>(dataset.nodes);

    nodes
        .enter()
        .insert('svg')
        .each(function (d: TreeGraphNodeData) {
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

    // let simulation = d3.forceSimulation().stop();
    // d3.forceSimulation([]) // Forcealgorithm is applied to data.nodes
    //     .force('link', d3.forceLink().links([]) // This force provides links between nodes
    //         .distance(100).strength(1))
    //     .force('charge', d3.forceManyBody().strength(-5000)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    //     .force('center', d3.forceCenter(props.width / 2, props.height / 2)) // This force attracts nodes to the center of the svg area
    //     .on('tick', ticked);


    // Let's list the force we na apply on the network
    // const simulation = d3.forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
    let simulation = d3.forceSimulation(dataset.nodes as TreeGraphNodeDataSimulation[]) // Forcealgorithm is applied to data.nodes
        .force('link', d3.forceLink().links(dataset.links) // This force provides links between nodes
            .id((d: any) => d.id) // This provide  the id of a node
            .distance(100).strength(1))
        .force('charge', d3.forceManyBody().strength(-5000)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
        .on('tick', ticked);

    // simulation.alpha(1).restart();
};

const positionOffset = (amountCouples: number, idx: number, axis: 'x' | 'y') => {
    if (amountCouples === 4) {
        if (idx === 0) {
            return axis === 'x' ? nodeWidth / 2 - coupleOffset : nodeHeight / 2 - coupleOffset;
        } else if (idx === 1) {
            return axis === 'x' ? nodeWidth / 2 + coupleOffset : nodeHeight / 2 + coupleOffset;
        } else if (idx === 2) {
            return axis === 'x' ? nodeWidth / 2 - coupleOffset : nodeHeight / 2 + coupleOffset;
        } else {
            return axis === 'x' ? nodeWidth / 2 + coupleOffset : nodeHeight / 2 - coupleOffset;
        }
    } else if (amountCouples === 3) {
        if (idx === 0) {
            return axis === 'x' ? nodeWidth / 2 - coupleOffset : nodeHeight / 2 - coupleOffset;
        } else if (idx === 1) {
            return axis === 'x' ? nodeWidth / 2 : nodeHeight / 2 + coupleOffset;
        } else {
            return axis === 'x' ? nodeWidth / 2 + coupleOffset : nodeHeight / 2 - coupleOffset;
        }
    } else if (amountCouples === 2) {
        if (idx === 0) {
            return axis === 'x' ? nodeWidth / 2 - coupleOffset : nodeHeight / 2;
        } else {
            return axis === 'x' ? nodeWidth / 2 + coupleOffset : nodeHeight / 2;
        }
    } else if (amountCouples === 1) {
        return axis === 'x' ? nodeWidth / 2 : nodeHeight / 2;
    }
};

const drawCircle = (d3Obj: d3.BaseType, data: TreeGraphNodeData, updateDirectRelation: (person: PersonEntry) => void) => {
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
        .on('mouseover', (_, personRaw: any) => {
            const person = personRaw as PersonEntry;
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
        .attr('x', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'x'))
        .attr('y', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'y'))
        .attr(
            'transform',
            `translate(${personDescTextOffsetX},${personDescTextOffsetY + row * personDescTextOffsetRowY})`,
        );
};

export {
    draw
};