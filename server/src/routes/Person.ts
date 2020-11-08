import express from 'express';
import Person from '../dbmodels/Person';
const router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/all', (req, res) => {
    const testPerson = {};
    res.status(200).json([testPerson]);
});

router.get('/:{id}', (req, res) => {
    const testPerson = {};
    res.status(200).json(testPerson);
});

router.post('/', (req, res) => {
    const testPerson = {};
    res.status(200).json(testPerson);
})

router.put('/:{id}', (req, res) => {
    const testPerson = {};
    res.status(200).json(testPerson);
})

router.delete('/:{id}', (req, res) => {
    const testPerson = {};
    res.status(200).json(testPerson);
})

export default router;