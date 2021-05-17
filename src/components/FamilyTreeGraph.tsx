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
import Config from '../libs/Config';
import { getPersonsFromServer, getTreeGraphDataFromServer } from '../libs/ParserCSVToPerson';
import { QueryFunctionContext, UseMutationResult, useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import queryConstants from '../libs/queryConstants';
import { apiCallGetPersons } from '../libs/api';
import { getParseTreeNode } from 'typescript';
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

const drawImageMaskCircle = (
    svgPerson: d3.Selection<SVGSVGElement, PersonEntry, d3.BaseType, unknown>,
    data: TreeGraphNodeData,
    updateDirectRelation: (
        person: PersonEntry,
        svgPerson: d3.Selection<SVGSVGElement, PersonEntry, d3.BaseType, unknown>,
        data: TreeGraphNodeData,
        triggerState: "enter" | "leave" | "unknown") => void, history) => {

    // <mask id="circle">
    //     <circle cx="490" cy="327" r="300" fill="black" />
    // </mask>
    const imagedim = 150;

    svgPerson
        .append('circle')
        .attr('class', `person node_${data.id}`)
        // .attr('id', (person: PersonEntry) => `person_${person.id}`)
        .attr('r', 50)
        .attr('stroke', 'black')
        .attr('stroke-width', '3')
        .attr('fill', '#FFFFFF')
        .attr('cx', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'x'))
        .attr('cy', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'y'))

    // d3.select(d3Obj).selectAll("mask")
    //     .data(data.data)
    //     .enter()

    svgPerson
        .append('mask')
        .attr('id', (dataX) => `mask_${dataX.id}`)
        .append('circle')
        .attr('id', (dataX) => `circlemask_${dataX.id}`)
        .attr('cx', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'x'))
        .attr('cy', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'y'))
        .attr('r', '49')
        .attr('fill', (person: PersonEntry) => {
            return person.markers.isHighlighted ? "#FFFFFF" : "#222222"
        });

    svgPerson
        .append('image')
        .attr('class', (person) => `image_${person.id}`)
        .attr('width', imagedim)
        .attr('height', imagedim)
        .attr("pointer-events", "none")
        .attr('mask', (person) => `url(#mask_${person.id})`)
        .attr('xlink:href', (person: PersonEntry) =>
            person.avatar
                ? `${Config.SERVER_IMAGE_AVATAR}/${person.avatar}`
                : "avatar_placeholder.png"
        )
        .attr('x', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'x') - imagedim / 2)
        .attr('y', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'y') - imagedim / 2)

    svgPerson
        .append('circle')
        // .attr('class', `person node_${data.id}`)
        // .attr('id', (person: PersonEntry) => `person_${person.id}`)
        .attr('r', 50)
        // .attr('stroke', 'black')
        // .attr('stroke-width', '3')
        .attr('fill-opacity', '0')
        .attr('cx', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'x'))
        .attr('cy', (person: PersonEntry, idx: number) => positionOffset(data.data.length, idx, 'y'))
        .on('mouseover', (_, personRaw: any) => {
            const person = personRaw as PersonEntry;
            svgPerson.select(`#circlemask_${person.id}`).attr('fill', "#FFFFFF");

            svgPerson.select(`#text_${person.id}_0`).attr('visibility', "hidden");
            svgPerson.select(`#text_${person.id}_1`).attr('visibility', "hidden");
            svgPerson.select(`#text_${person.id}_2`).attr('visibility', "hidden");
            svgPerson.select(`#text_${person.id}_3`).attr('visibility', "hidden");
        })
        .on('mouseout', (_, personRaw: any) => {
            const person = personRaw as PersonEntry;
            svgPerson.select(`#circlemask_${person.id}`).attr('fill', "#222222");

            svgPerson.select(`#text_${person.id}_0`).attr('visibility', "visible");
            svgPerson.select(`#text_${person.id}_1`).attr('visibility', "visible");
            svgPerson.select(`#text_${person.id}_2`).attr('visibility', "visible");
            svgPerson.select(`#text_${person.id}_3`).attr('visibility', "visible");
        })
        .on('click', (_, personRaw: any) => {
            const person = personRaw as PersonEntry;
            history.push(`/edit/${person.id}`);
        });

    writeText(svgPerson, data, 'forename', 0);
    writeText(svgPerson, data, 'lastname', 1);
    // writeText(svgPerson, data, 'birthName', 2);
    // writeText(svgPerson, data, 'birthdate', 3);
}


const writeText = (parentElement: any, data: TreeGraphNodeData, attribute: string, row: number) => {
    parentElement
        .append('text')
        .text((person: PersonEntry) => {
            return person.markers.isHighlighted
                ? ""
                : person[attribute]
        })
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
    const [personData, setPersonData] = useState<{ personList: Map<number, PersonEntry> | null, dataset: TreeGraphData | null }>({
        personList: null,
        dataset: null
    });

    const queryPerson = useQuery<Map<number, PersonEntry>, Error>(queryConstants.GET_PERSONS, apiCallGetPersons);

    useEffect(() => {
        async function fetchData() {
            if (queryPerson.data) {
                setPersonData({
                    dataset: getTreeGraphDataFromServer(queryPerson.data),
                    personList: queryPerson.data
                });
                // Logger.info("Data received", { dataset, personList });
            }
        }

        if (queryPerson.data && !queryPerson.isLoading) {
            d3.select("svg").selectAll("*").remove();
            fetchData();
        }
    }, [queryPerson.data, queryPerson.error, queryPerson.isLoading]);

    const draw = function (ref: React.MutableRefObject<SVGSVGElement>, dataset: TreeGraphData, width: number, height: number) {
        if (ref.current == null) return;

        // d3.select("g.parent").selectAll("*").remove();
        // d3.select("svg").select("g").selectAll("*").remove();

        let svg = d3.select(ref.current).select('g');
        // svg.select('g').selectAll('circle');
        // svg.exit().remove();//remove unneeded circles

        const updateRelation = (
            personParam: PersonEntry,
            svgPerson: d3.Selection<SVGSVGElement, PersonEntry, d3.BaseType, unknown>,
            data: TreeGraphNodeData,
            triggerState: "enter" | "leave" | "unknown") => {

            let updateComponent: boolean = true;
            // Check if already highlighted

            dataset.nodes = dataset.nodes.map<TreeGraphNodeData>((nodeData: TreeGraphNodeData) => {
                nodeData.data = nodeData.data.map<PersonEntry>((person: PersonEntry) => {
                    if (person.id === personParam.id) {
                        if (triggerState === "enter") {
                            if (person.markers.isHighlighted) {
                                updateComponent = false;
                            } else {
                                person.markers.isHighlighted = true;
                            }
                        } else if (triggerState === "leave") {
                            if (!person.markers.isHighlighted) {
                                updateComponent = false;
                            } else {
                                person.markers.isHighlighted = false;
                            }
                        }
                    } else {
                        person.markers.isHighlighted = false;
                    }

                    if (person.id === personParam.id) person.markers.isDirectRelation = 'self';
                    else if (personParam.id in person.parents) person.markers.isDirectRelation = 'parent';
                    else if (personParam.id in person.children) person.markers.isDirectRelation = 'child';
                    else person.markers.isDirectRelation = null;
                    return person;
                });
                return nodeData;
            });

            if (updateComponent) {
                svg.select(`#person_${personParam.id}`).selectAll("*").remove();
                drawImageMaskCircle(svgPerson, data, updateRelation, history);
            }

            // .attr('id', (person: PersonEntry) => `person_${person.id}`)
            // svg
            //     .selectAll('svg')
            //     .each(function (d: TreeGraphNodeData) {
            //         d3.select(this).selectAll(`.node_${d.id}`)
            //             .attr('fill', (person: PersonEntry) => {
            //                 if (person.markers.isDirectRelation === 'self') return '#FFCCCC';
            //                 else if (person.markers.isDirectRelation === 'parent') return '#CCFFCC';
            //                 else if (person.markers.isDirectRelation === 'child') return '#CCCCFF';
            //                 else return '#FFFFFF';
            //             })
            //         d3.select(this).selectAll(`#circlemask_${personParam.id}`)
            //             .attr('fill', (person: PersonEntry) => {
            //                 return '#FFFFFF';
            //             })
            //     });
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
                // drawCircle(this, d, updateRelation, history);
                // TODO make in one function and draw it 

                const svgPerson: d3.Selection<SVGSVGElement, PersonEntry, d3.BaseType, unknown> = d3.select(this)
                    .selectAll(`node_svg_${d.id}`)
                    .data(d.data)
                    .enter()
                    .append('svg')
                    .attr('id', (person: PersonEntry) => `person_${person.id}`)

                drawImageMaskCircle(svgPerson, d, updateRelation, history);
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
                .distance(200).strength(1))
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

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const zoom = d3.zoom()
            .scaleExtent([0.2, 40])
            .on("zoom", zoomed);

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

        draw(ref, personData.dataset, props.width, props.height);
    }, [props.height, props.width, personData]);

    let loadingState = "Loading";
    if (queryPerson.error)
        loadingState = queryPerson.error.message;
    else if (queryPerson.data)
        loadingState = "Done";

    const showLoadingStatus = (
        <div>
            <h1>Loading</h1>
            <h2>Users: {loadingState}</h2>
        </div>
    );
    return (
        (!queryPerson.isLoading
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


