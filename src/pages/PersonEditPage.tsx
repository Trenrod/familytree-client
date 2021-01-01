import React, { ReactElement, useEffect } from 'react';
import 'date-fns';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Chip, Container, createStyles, Fab, FormControl, Input, InputLabel, makeStyles, MenuItem, Paper, Select, Typography } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { IPersonEntry } from '../models/IPersonEntry';
import { useSnackbar } from 'notistack';
import { Logger } from '../libs/Logger';
import {
    useHistory
} from "react-router-dom";
import { FindUserByIdQuery, InputMarriageId, InputUserId, useAllUsersQuery, useCreateUserMutation, useFindUserByIdQuery, UserFieldsFragment, useUpdateUserMutation } from '../libs/generated/graphql';
import Config from '../libs/Config';
import {
    useParams
} from "react-router-dom";

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

interface IUserMapItem {
    id: String,
    forename: String,
    lastname: String
}

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
    user: IPersonEntry | null
}

export default function PersonEditPage(props: ModifyPersonProps): ReactElement {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const history = useHistory();
    const classes = useStyles();

    Logger.info("User Data", props.user);

    const [createPerson, setCreatePerson] = React.useState<IPersonEntry>({
        id: props.user?.id,
        forename: props.user?.forename || "",
        lastname: props.user?.lastname || "",
        birthdate: props.user?.birthdate || null,
        birthName: props.user?.birthName || "",
        dayOfDeath: props.user?.dayOfDeath || null,
        parents: props.user?.parents ?? [],
        children: props.user?.children ?? [],
        marriages: props.user?.marriages ?? [],
        placeOfBirth: props.user?.placeOfBirth ?? null,
        placeOfDeath: props.user?.placeOfDeath ?? null,
        gender: null,
        markers: null
    });


    const createUser = useCreateUserMutation(Config.USE_QUERY_INIT);
    const updateUser = useUpdateUserMutation(Config.USE_QUERY_INIT);
    const allUsers = useAllUsersQuery(Config.USE_QUERY_INIT);
    if (allUsers.data)
        Logger.info("Create data", allUsers.data);

    useEffect(() => {
        if (createUser.isError) {
            Logger.error("Failed to store/update", { error: createUser.error }, null)
            enqueueSnackbar(`Failed to create. ${createUser.error.toString()}`, {
                variant: "error"
            });
        } else if (updateUser.isError) {
            Logger.error("Failed to store/update", { error: updateUser.error }, null)
            enqueueSnackbar(`Failed to update. ${updateUser.error.toString()}`, {
                variant: "error"
            });
        }
        else if (createUser.isSuccess || updateUser.isSuccess) {
            history.push('/');
        }
    }, [createUser.status, updateUser.status]);

    const handleCreate = async () => {
        try {
            if (createPerson.id) {
                const result = await updateUser.mutate({
                    id: createPerson.id.toString(),
                    forename: createPerson.forename,
                    lastname: createPerson.lastname,
                    children: createPerson.children.map((childId): InputUserId => { return { id: childId.toString() } }),
                    parents: createPerson.parents.map((parentId): InputUserId => { return { id: parentId.toString() } }),
                    marriages: createPerson.marriages.map((marriageId): InputMarriageId => { return { id: marriageId.toString() } }),
                    marriageWithUserId: createPerson.marriages.map((marriageId): InputMarriageId => { return { id: marriageId.toString() } }),
                });
            } else {
                await createUser.mutate({
                    forename: createPerson.forename,
                    lastname: createPerson.lastname,
                    children: createPerson.children.map((childId): InputUserId => { return { id: childId.toString() } }),
                    parents: createPerson.parents.map((parentId): InputUserId => { return { id: parentId.toString() } }),
                    marriages: createPerson.marriages.map((marriageId): InputMarriageId => { return { id: marriageId.toString() } }),
                    marriageWithUserId: createPerson.marriages.map((marriageId): InputMarriageId => { return { id: marriageId.toString() } }),
                });
            }
        } catch (error) {
            Logger.error("Failed to store new person", {}, error);
            enqueueSnackbar("Failed to store new person.", {
                variant: "error"
            });
        }
    }

    const handleCancel = () => {
        history.push('/');
    }

    const handleDateOfBirthChange = (date: Date | null) => {
        setCreatePerson({ ...createPerson, birthdate: date });
    };

    const handleDateOfDeathChange = (date: Date | null) => {
        setCreatePerson({ ...createPerson, dayOfDeath: date });
    };

    let userMap = new Map<number, IUserMapItem>();
    let peopleOptionList = [];
    if (allUsers.isSuccess && allUsers.data) {
        allUsers.data.allUsers.forEach((value: UserFieldsFragment) => {
            peopleOptionList.push(<MenuItem key={`item_key_${value.id}`} value={value.id.toString()}>{`(${value.id}) ${value.forename} ${value.lastname}`}</MenuItem>);
            userMap.set(parseInt(value.id), {
                id: value.id,
                forename: value.forename,
                lastname: value.lastname
            })
        });
    }
    return (
        <Container maxWidth="md">
            <Typography variant="body1">Create new family member</Typography>
            <form className={classes.inputstyle}>
                {/* id,forename,lastname,birthname,birthdate,dayofdeath,placeofdeath,placeofbirth,fatherid,motherid,spouses */}
                <FormGroup row={true} >
                    <TextField id="standard-name" label="Forename" className={classes.inputstyle}
                        onChange={(event: any) => {
                            setCreatePerson({ ...createPerson, forename: event.target.value });
                        }}
                        value={createPerson.forename}
                    />
                    <TextField id="standard-name" label="Lastname" className={classes.inputstyle}
                        onChange={(event) => {
                            setCreatePerson({ ...createPerson, lastname: event.target.value });
                        }}
                        value={createPerson.lastname}
                    />
                </FormGroup>
                <FormGroup row={true} >
                    <TextField id="standard-name" label="Birthname" className={classes.inputstyle}
                        onChange={(event) => {
                            setCreatePerson({ ...createPerson, birthName: event.target.value });
                        }}
                        value={createPerson.birthName}
                    />
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
                </FormGroup>
                <FormGroup row={true} >
                    <FormControl className={classes.inputstyle}>
                        <InputLabel id="parentsLabelId">Parents</InputLabel>
                        <Select
                            labelId="parentsLabelId"
                            id="parentsId"
                            multiple
                            value={createPerson.parents.map((id) => id.toString())}
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
                                    ...createPerson, parents: value
                                });
                            }}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected: string[]) => (
                                <div className={classes.chips}>
                                    {selected.map((value: string) => (
                                        <Chip
                                            key={value}
                                            label={userMap.get(parseInt(value))?.forename}
                                            className={classes.chip} />
                                    ))}
                                </div>
                            )}
                        >
                            {peopleOptionList}
                        </Select>
                    </FormControl>
                </FormGroup>
                <FormGroup row={true} >
                    <FormControl className={classes.inputstyle}>
                        <InputLabel id="childrenLabelId">Children</InputLabel>
                        <Select
                            labelId="childrenLabelId"
                            id="childrenId"
                            multiple
                            value={createPerson.children.map((id) => id.toString())}
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
                                    ...createPerson, children: value
                                });
                            }}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected: string[]) => (
                                <div className={classes.chips}>
                                    {selected.map((value: string) => (
                                        <Chip
                                            key={value}
                                            label={userMap.get(parseInt(value))?.forename}
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
                <FormGroup row={true} >
                    <FormControl className={classes.inputstyle}>
                        <InputLabel id="marriagesLabelId">Marriages</InputLabel>
                        <Select
                            labelId="marriagesLabelId"
                            id="marriagesId"
                            multiple
                            value={createPerson.marriages.map((id) => id.toString())}
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
                                    ...createPerson, marriages: value
                                });
                            }}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected: string[]) => (
                                <div className={classes.chips}>
                                    {selected.map((value: string) => (
                                        <Chip
                                            key={value}
                                            label={userMap.get(parseInt(value))?.forename}
                                            className={classes.chip}
                                        />
                                    ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                        >
                            {peopleOptionList}
                        </Select>
                    </FormControl>
                </FormGroup>
            </form>
            <FormGroup>
                <Button onClick={() => { handleCancel(); }} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => {
                    handleCreate();
                }} color="primary">
                    Create
                </Button>
            </FormGroup>
        </Container>
    );
}
