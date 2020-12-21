import React, { ReactElement } from 'react';
import 'date-fns';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Chip, createStyles, Fab, FormControl, Input, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { FormGroup } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
} from '@material-ui/pickers';
import PersonEntry from '../models/PersonEntry';
import Axios from 'axios';
import CONFIG from '../libs/Config';
import { IPersonEntry } from '../models/IPersonEntry';
import { useSnackbar } from 'notistack';
import { Logger } from '../libs/Logger';

const useStyles = makeStyles(() =>
    createStyles({
        inputstyle: {
            margin: '0.5rem',
            flexGrow: 1
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
    }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface ModifyPersonProps {
    personData: Map<number, PersonEntry>;
}

export default function ModifyPerson(props: ModifyPersonProps): ReactElement {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [createPerson, setCreatePerson] = React.useState<IPersonEntry>({
        birthdate: null,
        birthName: null,
        dayOfDeath: null,
        fatherId: null,
        forename: null,
        id: null,
        lastname: null,
        marriedToId: [],
        motherId: null,
        placeOfBirth: null,
        placeOfDeath: null,
        gender: null,
        markers: null
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = async () => {
        try {
            const result = await Axios.post(`${CONFIG.SERVER_API_URL}\\person`, createPerson);
            enqueueSnackbar("Successfully stored", {
                variant: "success"
            });
        } catch (error) {
            Logger.error("Failed to store new person", {}, error);
            enqueueSnackbar("Failed to store new person.", {
                variant: "error"
            });
        }
    }

    const handleDateOfBirthChange = (date: Date | null) => {
        setCreatePerson({ ...createPerson, birthdate: date });
    };

    const handleDateOfDeathChange = (date: Date | null) => {
        setCreatePerson({ ...createPerson, dayOfDeath: date });
    };

    let peopleOptionList = [<MenuItem key={''} value={'unknown'}>Unknown</MenuItem>];
    props.personData.forEach((value: PersonEntry) => {
        peopleOptionList.push(<MenuItem key={value.id} value={value.id.toString()}>{`(${value.id}) ${value.forename} ${value.lastname}`}</MenuItem>);
    });
    console.log("FatherId: " + createPerson.fatherId);
    return (
        <div>
            <Fab color="primary" aria-label="add" style={{
                position: 'fixed',
                bottom: '5rem',
                right: '5rem'
            }} onClick={handleClickOpen}>
                <AddIcon />
            </Fab>
            <Dialog maxWidth="lg" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create new family member</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Family
                    </DialogContentText>
                    <form className={classes.inputstyle}>
                        {/* id,forename,lastname,birthname,birthdate,dayofdeath,placeofdeath,placeofbirth,fatherid,motherid,marriedtoid */}
                        <FormGroup row={true} >
                            <TextField id="standard-name" label="Forename" className={classes.inputstyle}
                                onChange={(event: any) => {
                                    setCreatePerson({ ...createPerson, forename: event.target.value });
                                }} />
                            <TextField id="standard-name" label="Lastname" className={classes.inputstyle}
                                onChange={(event) => {
                                    setCreatePerson({ ...createPerson, lastname: event.target.value });
                                }} />
                        </FormGroup>
                        <FormGroup row={true} >
                            <TextField id="standard-name" label="Birthname" className={classes.inputstyle}
                                onChange={(event) => {
                                    setCreatePerson({ ...createPerson, birthName: event.target.value });
                                }} />
                        </FormGroup>
                        <FormGroup row={true} style={{ justifyContent: 'space-between' }}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker className={classes.inputstyle}
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date of birth"
                                    format="MM/dd/yyyy"
                                    value={createPerson.birthdate}
                                    onChange={handleDateOfBirthChange}
                                />
                            </MuiPickersUtilsProvider>
                            <TextField id="standard-name" label="Place of birth" className={classes.inputstyle}
                                onChange={(event) => {
                                    setCreatePerson({ ...createPerson, placeOfBirth: event.target.value });
                                }}
                            />
                        </FormGroup>
                        <FormGroup row={true} style={{ justifyContent: 'space-between' }}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker className={classes.inputstyle}
                                    margin="normal"
                                    label="Date of death"
                                    format="MM/dd/yyyy"
                                    value={createPerson.dayOfDeath}
                                    onChange={handleDateOfDeathChange}
                                />
                            </MuiPickersUtilsProvider>
                            <TextField id="standard-name" label="Place of dead" className={classes.inputstyle}
                                onChange={(event) => {
                                    setCreatePerson({ ...createPerson, placeOfDeath: event.target.value });
                                }} />
                        </FormGroup>
                        <FormGroup row={true} >
                            <FormControl className={classes.inputstyle}>
                                <InputLabel htmlFor="fatherId">Father</InputLabel>
                                <Select
                                    id="fatherId"
                                    value={createPerson.fatherId == null
                                        ? 'unknown'
                                        : createPerson.fatherId.toString()}
                                    onChange={(event: any) => {
                                        try {
                                            let value = null;
                                            if (event.target.value != null && event.target.value !== 'unknown') {
                                                value = parseInt(event.target.value);
                                            }
                                            setCreatePerson({ ...createPerson, fatherId: value });
                                        } catch (error) {
                                            console.error(error);
                                        }
                                    }}
                                >
                                    {peopleOptionList}
                                </Select>
                            </FormControl>
                        </FormGroup>
                        <FormGroup row={true} >
                            <FormControl className={classes.inputstyle}>
                                <InputLabel htmlFor="motherId">Mother</InputLabel>
                                <Select
                                    id="motherId"
                                    value={createPerson.motherId == null
                                        ? 'unknown'
                                        : createPerson.motherId.toString()}
                                    onChange={(event: any) => {
                                        try {
                                            let value = null;
                                            if (event.target.value != null && event.target.value !== 'unknown') {
                                                value = parseInt(event.target.value);
                                            }
                                            setCreatePerson({ ...createPerson, motherId: value });
                                        } catch (error) {
                                            console.error(error);
                                        }
                                    }}
                                >
                                    {peopleOptionList}
                                </Select>
                            </FormControl>
                        </FormGroup>
                        <FormGroup row={true} >
                            <FormControl className={classes.inputstyle}>
                                <InputLabel id="marriedWithLabelId">Married with</InputLabel>
                                <Select
                                    labelId="marriedWithLabelId"
                                    id="marriedWithId"
                                    multiple
                                    value={createPerson.marriedToId}
                                    onChange={(event: any) => {
                                        let value: number[] = [];
                                        try {
                                            if (event.target.value != null && event.target.value !== 'unknown') {
                                                if (Array.isArray(event.target.value)) {
                                                    value = event.target.value.map((value: string) =>
                                                        parseInt(value)
                                                    )
                                                } else {
                                                    value = [parseInt(event.target.value)];
                                                }
                                            }
                                        } catch (error) {
                                            console.error(error);
                                        }
                                        setCreatePerson({
                                            ...createPerson, marriedToId: value
                                        });
                                    }}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={(selected: number[]) => (
                                        <div className={classes.chips}>
                                            {selected.map((value: number) => (
                                                <Chip
                                                    key={value}
                                                    label={props.personData.get(value).forename}
                                                    className={classes.chip} />
                                            ))}
                                        </div>
                                    )}
                                // MenuProps={MenuProps}
                                >
                                    {peopleOptionList}
                                </Select>
                            </FormControl>
                        </FormGroup>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}