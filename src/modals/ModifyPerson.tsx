import React, { ReactElement } from 'react';
import 'date-fns';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Chip, createStyles, Fab, FormControl, Input, InputLabel, makeStyles, MenuItem, Select} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { FormGroup } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
} from '@material-ui/pickers';
import PersonEntry from '../models/PersonEntry';

const useStyles = makeStyles(() =>
    createStyles({
        inputstyle: {
            margin: '0.5rem',
            flexGrow: 1
        },
    }),
);

interface ModifyPersonProps {
  personData: PersonEntry[];
}

export default function ModifyPerson(props: ModifyPersonProps): ReactElement {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [selectedDateOfBirth, setDateOfBirth] = React.useState<Date | null>(
        null
    );
    const handleDateOfBirthChange = (date: Date | null) => {
        setDateOfBirth(date);
    };

    const [selectedDateOfDeath, setDateOfDeath] = React.useState<Date | null>(
        null
    );
    const handleDateOfDeathChange = (date: Date | null) => {
        setDateOfDeath(date);
    };

    const peopleOptionList = props.personData.map((value: PersonEntry) => {
        return (<option key={value.id} value={value.id}>{`(${value.id}) ${value.forename} ${value.lastname}`}</option>);
    });

    return (
        <div>

            <Fab color="primary" aria-label="add" style={{
                position:'fixed',
                bottom: '5rem',
                right:'5rem'
            }}onClick={handleClickOpen}>
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
                            <TextField id="standard-name" label="Forename" onChange={() => {}} className={classes.inputstyle} />
                            <TextField id="standard-name" label="Lastname" onChange={() => {}} className={classes.inputstyle} />
                        </FormGroup>
                        <FormGroup row={true} >
                            <TextField id="standard-name" label="Current residence" onChange={() => {}} className={classes.inputstyle} />
                            <TextField id="standard-name" label="Birthname" onChange={() => {}} className={classes.inputstyle} />
                        </FormGroup>
                        <FormGroup row={true} style={{justifyContent: 'space-between'}}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker className={classes.inputstyle}
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date of birth"
                                    format="MM/dd/yyyy"
                                    value={selectedDateOfBirth}
                                    onChange={handleDateOfBirthChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}/>
                            </MuiPickersUtilsProvider>
                            <TextField id="standard-name" label="Place of birth" onChange={() => {}} className={classes.inputstyle} />
                        </FormGroup>
                        <FormGroup row={true} style={{justifyContent: 'space-between'}}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker className={classes.inputstyle}
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date of death"
                                    format="MM/dd/yyyy"
                                    value={selectedDateOfDeath}
                                    onChange={handleDateOfDeathChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}/>
                            </MuiPickersUtilsProvider>
                            <TextField id="standard-name" label="Place of dead" onChange={() => {}} className={classes.inputstyle} />
                        </FormGroup>
                        <FormGroup row={true} >
                            <FormControl className={classes.inputstyle}>
                                <InputLabel htmlFor="age-native-simple">Father</InputLabel>
                                <Select                                 
                                    native
                                    value={'xxx'}
                                    onChange={()=>{}}
                                    inputProps={{
                                        name: 'age',
                                        id: 'age-native-simple',
                                    }}
                                >
                                    {peopleOptionList}
                                </Select>
                            </FormControl>
                        </FormGroup>
                        <FormGroup row={true} >
                            <FormControl className={classes.inputstyle}>
                                <InputLabel htmlFor="age-native-simple">Father</InputLabel>
                                <Select                                 
                                    native
                                    value={'xxx'}
                                    onChange={()=>{}}
                                    inputProps={{
                                        name: 'age',
                                        id: 'age-native-simple',
                                    }}
                                >
                                    {peopleOptionList}
                                </Select>
                            </FormControl>
                            {/* <TextField id="standard-name" label="Father" onChange={() => {}} className={classes.inputstyle} />
                            <TextField id="standard-name" label="Mother" onChange={() => {}} className={classes.inputstyle} /> */}
                        </FormGroup>
                        <FormGroup row={true} >
                            {/* <FormControl className={classes.inputstyle}>
                                <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
                                <Select
                                    labelId="demo-mutiple-chip-label"
                                    id="demo-mutiple-chip"
                                    multiple
                                    value={personName}
                                    onChange={handleChange}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={(selected) => (
                                        <div className={classes.chips}>
                                            {(selected as string[]).map((value) => (
                                                <Chip key={value} label={value} className={classes.chip} />
                                            ))}
                                        </div>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {names.map((name) => (
                                        <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                        </FormGroup>
                        <FormGroup row={true} >
                            <FormControl className={classes.inputstyle}>
                                <InputLabel htmlFor="age-native-simple">Married with</InputLabel>
                                <Select                                 
                                    native
                                    value={'xxx'}
                                    onChange={()=>{}}
                                    inputProps={{
                                        name: 'age',
                                        id: 'age-native-simple',
                                    }}
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
                    <Button onClick={handleClose} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}