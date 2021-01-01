import express from 'express';
import { PersonDB } from "../dbmodels/PersonDB";
import { ERROR_CODES, FTError } from '../libs/Errorcode';
import PersistanceManager from '../libs/PersistanceManager';
import { isMarriage } from '../models/MarriageCheck';
import { Marriage, PersonWithId } from '../restapi/Api';

const router = express.Router();
const perstMge: PersistanceManager = PersistanceManager.getInstance();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/all', async (req, res) => {
    try {
        const marriages = await perstMge.readAllMarriages();
        res.status(200).json(marriages);
    } catch (exception) {
        const error: FTError = {
            code: ERROR_CODES.ERROR_INTERNAL_SERVER_ERROR,
            message: exception.message
        };
        res.status(500).json(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        if (req.params.id == null) {
            const error: FTError = {
                code: ERROR_CODES.ERROR_INVALID_REQUEST,
                message: "Path param id missing"
            }
            res.status(400).json(error);
            return;
        } else if (Number(req.params.id) === NaN) {
            const error: FTError = {
                code: ERROR_CODES.ERROR_INVALID_REQUEST,
                message: "Path param id must be number"
            }
            res.status(400).json(error);
            return;
        }

        const marriage = await perstMge.readMarriage(Number(req.params.id));
        if (marriage != null) {
            res.status(200).json(marriage.toJSON());
            return;
        }
        res.status(204).json(null);
    } catch (exception) {
        const error: FTError = {
            code: ERROR_CODES.ERROR_INTERNAL_SERVER_ERROR,
            message: exception.message
        };
        res.status(500).json(error);
    }
});


router.post('/', async (req, res) => {
    try {
        if (req.body == null || !isMarriage(req.body)) {
            const error: FTError = {
                code: ERROR_CODES.ERROR_INVALID_REQUEST,
                message: "Invalid object in body. Expected type marriages."
            }
            res.status(400).json(error);
            return;
        }

        const marriageReq = req.body as Marriage;
        if (marriageReq.personId1 == null || marriageReq.personId2 == null) {
            const error: FTError = {
                code: ERROR_CODES.ERROR_MARRIED_PERSON_NOT_FOUND,
                message: `Invalid object in body. Expected type marriages. ${marriageReq.personId1 == null ? "personId1" : "personId2"}`
            }
            res.status(400).json(error);
            return;
        }

        const marriageP1 = await perstMge.readPerson(marriageReq.personId1);
        const marriageP2 = await perstMge.readPerson(marriageReq.personId2);
        if (marriageP1 && marriageP2) {
            const data = await perstMge.createMarriage({
                personId1: marriageReq.personId1,
                personId2: marriageReq.personId2
            });
            res.status(201).jsonp(data.toJSON());
        } else {
            const error: FTError = {
                code: ERROR_CODES.ERROR_MARRIED_PERSON_NOT_FOUND,
                message: `Could not find married person with id:${marriageP1 == null ? marriageReq.personId1 : marriageReq.personId2}`
            }
            res.status(400).json(error);
            return;
        }
    } catch (execption) {
        const error: FTError = {
            code: ERROR_CODES.ERROR_INTERNAL_SERVER_ERROR,
            message: execption.message
        }
        res.status(500).json(error);
    }
})

router.put('/:id', async (req, res) => {
    if (req.params.id == null) {
        const error: FTError = {
            code: ERROR_CODES.ERROR_INVALID_REQUEST,
            message: "Path param id missing"
        }
        res.status(400).json(error);
        return;
    } else if (Number(req.params.id) === NaN) {
        const error: FTError = {
            code: ERROR_CODES.ERROR_INVALID_REQUEST,
            message: "Path param id must be number"
        }
        res.status(400).json(error);
        return;
    }
    const person = await perstMge.readPerson(Number(req.params.id));
    if (person != null) {
        await person.update(req.body as PersonWithId);
        res.status(200).json(person.toJSON());
        return;
    }
    res.status(203).json(null);
})

router.delete('/:id', async (req, res) => {
    if (req.params.id == null) {
        const error: FTError = {
            code: ERROR_CODES.ERROR_INVALID_REQUEST,
            message: "Path param id missing"
        }
        res.status(400).json(error);
        return;
    } else if (Number(req.params.id) === NaN) {
        const error: FTError = {
            code: ERROR_CODES.ERROR_INVALID_REQUEST,
            message: "Path param id must be number"
        }
        res.status(400).json(error);
        return;
    }
    const person = await perstMge.readPerson(Number(req.params.id));
    if (person != null) {
        await person.destroy();
        res.status(200).json(person.toJSON());
        return;
    }
    res.status(203).json(null);
})

export default router;
