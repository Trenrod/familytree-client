import { TreeGraphData } from '../models/TreeGraphNodeData';

const data: TreeGraphData = {
    nodes: [
        {
            id: 1,
            data: [
                {
                    id: 1,
                    forename: 'Albert',
                    lastname: 'Dorn',
                    birthdate: '26.09.1983',
                },
            ],
        },
        {
            id: 2,
            data: [
                {
                    id: 2,
                    forename: 'Elvira',
                    lastname: 'Litzinger',
                    birthName: 'Dorn',
                    birthdate: '10.01.1968',
                },
                {
                    id: 3,
                    forename: 'Eduard',
                    lastname: 'Litzinger',
                    birthName: '',
                    birthdate: '',
                },
            ],
        },
        {
            id: 3,
            data: [
                {
                    id: 4,
                    forename: 'Andreas',
                    lastname: 'Dorn',
                    birthName: '',
                    birthdate: '01.01.1970',
                },
                {
                    id: 5,
                    forename: 'Luba',
                    lastname: 'Dorn',
                    birthName: 'Bruch',
                    birthdate: '',
                },
            ],
        },
        {
            id: 4,
            data: [
                {
                    id: 6,
                    forename: 'Ewald',
                    lastname: 'Dorn',
                    birthName: '',
                    birthdate: '15.04.1935',
                },
                {
                    id: 7,
                    forename: 'Maria',
                    lastname: 'Dorn',
                    birthName: 'Miller',
                    birthdate: '30.06.1946',
                },
            ],
        },
        {
            id: 5,
            data: [
                {
                    id: 8,
                    forename: 'Veronika',
                    lastname: 'Dorn',
                    birthName: '',
                    birthdate: '',
                },
            ],
        },
        {
            id: 6,
            data: [
                {
                    id: 9,
                    forename: 'Alina',
                    lastname: 'Dorn',
                    birthName: '',
                    birthdate: '',
                },
            ],
        },
        {
            id: 7,
            data: [
                {
                    id: 10,
                    forename: 'Matthias',
                    lastname: 'Litzinger',
                    birthName: '',
                    birthdate: '',
                },
            ],
        },
        {
            id: 8,
            data: [
                {
                    id: 11,
                    forename: 'Christina',
                    lastname: 'Litzinger',
                    birthName: '',
                    birthdate: '',
                },
            ],
        },
        {
            id: 9,
            data: [
                {
                    id: 12,
                    forename: 'Leonard',
                    lastname: 'Litzinger',
                    birthName: '',
                    birthdate: '',
                },
            ],
        },
        {
            id: 10,
            data: [
                {
                    id: 13,
                    forename: 'Herrmann',
                    lastname: 'Dorn',
                    birthName: '',
                    birthdate: '',
                },
                {
                    id: 14,
                    forename: 'Ida',
                    lastname: 'Linch/Dorn',
                    birthName: 'Esse',
                    birthdate: '',
                },
                {
                    id: 15,
                    forename: '---',
                    lastname: 'Linich',
                    birthName: '',
                    birthdate: '',
                },
            ],
        },
        {
            id: 11,
            data: [
                {
                    id: 16,
                    forename: 'Reinhold',
                    lastname: 'Linich',
                    birthName: '',
                    birthdate: '',
                },
            ],
        },
    ],
    links: [
        {

            source: 1,
            target: 4,
        },
        {
            source: 2,
            target: 4,
        },
        {
            source: 3,
            target: 4,
        },
        {
            source: 5,
            target: 3,
        },
        {
            source: 6,
            target: 3,
        },
        {
            source: 7,
            target: 2,
        },
        {
            source: 8,
            target: 2,
        },
        {
            source: 9,
            target: 2,
        },
        {
            source: 10,
            target: 4,
        },
        {
            source: 10,
            target: 11,
        },
    ],
};

export default data;
