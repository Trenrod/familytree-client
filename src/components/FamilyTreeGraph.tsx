import React, { ReactElement, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TreeGraphData, TreeGraphLinkData, TreeGraphNodeData, TreeGraphNodeDataSimulation } from '../models/TreeGraphNodeData';
import PersonEntry from '../models/PersonEntry';
import { D3ZoomEvent, zoomTransform } from 'd3';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
    Link,
    useHistory
} from "react-router-dom";
import { Logger } from '../libs/Logger';
import { useAllMarriagesQuery, useAllUsersQuery } from '../libs/generated/graphql';
import Config from '../libs/Config';
import { getPersonsFromServer, getTreeGraphDataFromServer } from '../libs/ParserCSVToPerson';
// import { draw } from '../libs/d3treehelper';


const nodeWidth = 200;
const nodeHeight = 200;
const coupleOffset = 40;
// const personTileWidth = 90;
// const personTileHeight = 120;

const personDescTextOffsetY = 0;
const personDescTextOffsetRowY = 15;
const personDescTextOffsetX = 0;



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

const drawCircle = (d3Obj: d3.BaseType, data: TreeGraphNodeData, updateDirectRelation: (person: PersonEntry) => void, history) => {
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
        .on('click', (_, personRaw: any) => {
            const person = personRaw as PersonEntry;
            history.push(`/edit/${person.id}`);
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



interface FamilyTreeGraphProps {
    width: number;
    height: number;
    // data: TreeGraphData;
}

export default function FamilyTreeGraph(props: FamilyTreeGraphProps): ReactElement {
    // const [dataChanged, setDataChanged] = useState<boolean>(true);
    console.log("Start");
    const [personData, setPersonData] = useState<{ personList: Map<number, PersonEntry> | null, dataset: TreeGraphData | null }>({
        personList: null,
        dataset: null
    });
    const useAllUsers = useAllUsersQuery(Config.USE_QUERY_INIT);
    const useAllMarriages = useAllMarriagesQuery(Config.USE_QUERY_INIT);
    useEffect(() => {
        async function fetchData() {
            if (useAllUsers.data.allUsers) {
                const dataset = await getTreeGraphDataFromServer(useAllUsers.data.allUsers, useAllMarriages.data.allMarriages);
                const personList = await getPersonsFromServer(useAllUsers.data.allUsers);
                setPersonData({ dataset, personList });
                Logger.info("Data received", { dataset, personList });
            }
        }

        if (useAllUsers.data &&
            useAllUsers.status === "success" &&
            useAllMarriages.data &&
            useAllMarriages.status === "success")
            fetchData();
    }, [useAllUsers.data, useAllMarriages]);

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
                    else if (personParam.id in person.parents) person.markers.isDirectRelation = 'parent';
                    else if (personParam.id in person.children) person.markers.isDirectRelation = 'child';
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
        const nodes = svg.selectAll('svg')
            .data<TreeGraphNodeData>(dataset.nodes)
            .enter()
            .insert('svg')
            .each(function (d: TreeGraphNodeData) {
                drawCircle(this, d, updateRelation, history);
                writeText(this, d, 'forename', 0);
                writeText(this, d, 'lastname', 1);
                writeText(this, d, 'birthName', 2);
                writeText(this, d, 'birthdate', 3);
            });

        const nodeAttr = nodes;

        // This function is run at each iteration of the force algorithm, updating the nodes position.
        const ticked = () => {
            link
                .attr('x1', (d: TreeGraphLinkData) => (d.source as TreeGraphNodeDataSimulation).x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);
            link.exit().remove();

            nodeAttr
                .attr('x', (d: any) => {
                    return d.x - nodeHeight / 2;
                })
                .attr('y', (d: any) => d.y - nodeWidth / 2)
                .attr('width', nodeWidth)
                .attr('height', nodeHeight);
            nodeAttr.exit().remove();
        }

        const simulation = d3.forceSimulation(dataset.nodes as TreeGraphNodeDataSimulation[]) // Forcealgorithm is applied to data.nodes
            .force('link', d3.forceLink().links(dataset.links) // This force provides links between nodes
                .id((d: any) => d.id) // This provide  the id of a node
                .distance(150).strength(1))
            .force('charge', d3.forceManyBody().strength(-5000)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
            .on('tick', ticked);
    };

    const ref = useRef<SVGSVGElement>();
    const history = useHistory();
    let innerSvg: any | null = null;

    function zoomed({ transform }) {
        if (innerSvg != null)
            innerSvg.attr("transform", transform);
    }

    useEffect(() => {
        if (personData.dataset == null || personData.personList == null) return;
        if (ref.current == null) return;
        console.log("Trigger height and zoom");
        const zoom = d3.zoom()
            .scaleExtent([0.2, 40])
            .on("zoom", zoomed);
        const svg = d3.select(ref.current);
        innerSvg =
            svg.attr('width', "100vw")
                .attr('height', '100vh')
                .append("g")
                .attr("width", "5000")
                .attr("height", "5000");

        svg.call(
            zoom.transform,
            d3.zoomIdentity.translate(-500 + window.innerWidth / 2, -500 + window.innerHeight / 2).scale(.2)
        );

        svg.call(zoom);

        console.log("Trigger draw");
        draw(ref, personData.dataset, props.width, props.height);
    }, [props.height, props.width, personData]);

    const showLoadingStatus = (
        <div>
            <h1>Loading</h1>
            <h2>Users: {useAllUsers.status}</h2>
            <h2>Marriages: {useAllMarriages.status}</h2>
        </div>
    );
    return (
        (useAllUsers.status === "success" && useAllMarriages.status === "success"
            ? <div style={{ "overflow": "hidden" }}>
                <svg ref={ref} />
                <Fab color="primary" aria-label="add" style={{
                    position: 'fixed',
                    bottom: '2%',
                    right: '2%'
                }} onClick={() => {
                    history.push('/create');
                }}>
                    <AddIcon />
                </Fab>
            </div >
            : showLoadingStatus
        )
    );
}
