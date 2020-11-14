import express from 'express';
import { Person, PersonCreationAttributes } from '../dbmodels/Person';
import { ERROR_CODES, FTError } from '../libs/Errorcode';
import PersistanceManager from '../libs/PersistanceManager';

const router = express.Router();
const perstMge: PersistanceManager = PersistanceManager.getInstance();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/all', async (req, res) => {
    const persons = await perstMge.readAllPersons();
    res.status(200).json(persons);
});

router.get('/:id', async (req, res) => {
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
        res.status(200).json(person.toJSON());
        return;
    }
    res.status(204).json(null);
});


router.post('/', async (req, res) => {
    if (!Person.isPersonCreationAttributes(req.body)) {
        const error: FTError = {
            code: ERROR_CODES.ERROR_INVALID_REQUEST,
            message: "Invalid object in body. Expected type Person."
        }
        res.status(400).json(error);
        return;
    }

    const person = await perstMge.createPerson(req.body as Person);
    if (person != null)
        res.status(201).json(person.toJSON());
    res.status(204).json(null);
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
        await person.update(req.body as PersonCreationAttributes);
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
