import React, { ReactElement, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface D3testProps {
    width: number;
    height: number;
    data: number[]
}

export default function D3test(props: D3testProps): ReactElement {
    const ref = useRef<SVGSVGElement>();

    const [nodeData, setNodeData] = useState<number[]>(props.data);

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

        const circles = svg.selectAll('circle')
            .data(nodeData)
            .enter()
            .append('circle')
            .attr('r', () => 10)
            .attr('cy', 50)
            .attr('cx', (a, idx: number, c) => {
                console.log('Test: ' + JSON.stringify(c));
                return 50 * idx + 50;
            });

        let x = 1;
        setInterval(() => {
            const circles = svg.selectAll('circle')
                .data(nodeData)
                .attr('r', () => 10)
                .attr('cy', 50)
                .attr('cx', (a, idx: number, c) => {
                    x += 1;
                    console.log('Test: ' + JSON.stringify(c));
                    return 50 * idx + x;
                });
        }, 1000);
    };

    useEffect(() => {
        draw();
    }, [props.data, draw]);


    return (
        <div className="chart">
            <svg ref={ref} />
        </div>
    );
}