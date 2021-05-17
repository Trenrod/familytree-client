import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import 'date-fns';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Avatar, Card, CardActions, CardContent, Chip, Container, createStyles, FormControl, Grid, Input, InputLabel, makeStyles, MenuItem, Paper, Select, Tab, Tabs } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { IPersonAPIEntry } from '../models/IPersonAPIEntry';
import { useSnackbar } from 'notistack';
import { Logger } from '../libs/Logger';
import {
    useHistory
} from "react-router-dom";
import Config from '../libs/Config';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { useMutation, useQuery } from 'react-query';
import queryConstants from '../libs/queryConstants';
import { apiCallCreatePerson, apiCallDeletePerson, apiCallGetPersons, apiCallUpdatePerson } from '../libs/api';
import PersonEntry from '../models/PersonEntry';

enum EnumShowInfo {
    PROFILE,
    BIOGRAPHY,
    IMAGES
}

const useStyles = makeStyles(() =>
    createStyles({
        tab: {
        },
        avatar: {
            width: "10rem",
            height: "10rem",
        },
        inputFile: {

        },
        inputButton: {

        },
        container: {
            paddingTop: "1rem",
            paddingBottom: "1rem"
        },
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
    id: number,
    forename: String,
    lastname: String,
    birthday: Date
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
    user: IPersonAPIEntry | null
}

export default function PersonEditPage(props: ModifyPersonProps): ReactElement {
    const { enqueueSnackbar } = useSnackbar();

    const history = useHistory();
    const classes = useStyles();

    const [showProfileOrBio, setShowProfileOrBio] = useState<EnumShowInfo>(EnumShowInfo.PROFILE);

    const [createPerson, setCreatePerson] = React.useState<IPersonAPIEntry>({
        id: props.user?.id,
        forename: props.user?.forename || "",
        lastname: props.user?.lastname || "",
        birthdate: props.user?.birthdate || null,
        birthname: props.user?.birthname || "",
        dayOfDeath: props.user?.dayOfDeath || null,
        children: [],
        bio: props.user?.bio || null,
        avatar: props.user?.avatar || null,
        parents: props.user?.parents ?? [],
        marriages: props.user?.marriages ?? [],
        placeOfBirth: props.user?.placeOfBirth ?? null,
        placeOfDeath: props.user?.placeOfDeath ?? null,
        gender: null,
        markers: null
    });

    const mutateCreatePerson = useMutation<PersonEntry, Error, IPersonAPIEntry>(queryConstants.CREATE_PERSON,
        (createPerson: IPersonAPIEntry) => apiCallCreatePerson(createPerson)
    );

    const mutateUpdatePerson = useMutation<PersonEntry, Error, IPersonAPIEntry>(queryConstants.UPDATE_PERSON,
        (updatePerson: IPersonAPIEntry) => apiCallUpdatePerson(updatePerson)
    );

    const mutateDeletePerson = useMutation<PersonEntry, Error, { id: number }>(queryConstants.DELETE_PERSON,
        (deletePerson: { id: number }) => apiCallDeletePerson(deletePerson.id)
    );

    const allPersons = useQuery<Map<number, PersonEntry>, Error>(queryConstants.GET_PERSONS, apiCallGetPersons);

    useEffect(() => {
        if (mutateCreatePerson.error) {
            Logger.error("Failed to store/update", { error: mutateCreatePerson.error }, null)
            enqueueSnackbar(`Failed to create. ${mutateCreatePerson.error.toString()}`, {
                variant: "error"
            });
        } else if (mutateUpdatePerson.error) {
            Logger.error("Failed to store/update", { error: mutateUpdatePerson.error }, null)
            enqueueSnackbar(`Failed to update. ${mutateUpdatePerson.error.toString()}`, {
                variant: "error"
            });
        }
    }, [mutateCreatePerson, mutateUpdatePerson]);

    const changeBioContent = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCreatePerson({ ...createPerson, bio: event.target.value });
    }

    const handleCreate = async () => {
        try {
            if (createPerson.id) {
                await mutateUpdatePerson.mutateAsync({
                    id: createPerson.id,
                    bio: createPerson.bio,
                    forename: createPerson.forename,
                    lastname: createPerson.lastname,
                    birthname: createPerson.birthname,
                    birthdate: createPerson.birthdate,
                    dayOfDeath: createPerson.dayOfDeath,
                    parents: createPerson.parents.map((id: number): number => id),
                    marriages: createPerson.marriages.map((id: number): number => id),
                    children: []
                });
                history.goBack();
            } else {
                await mutateCreatePerson.mutateAsync({
                    id: null,
                    forename: createPerson.forename,
                    lastname: createPerson.lastname,
                    birthname: createPerson.birthname,
                    birthdate: createPerson.birthdate,
                    bio: createPerson.bio,
                    dayOfDeath: createPerson.dayOfDeath,
                    parents: createPerson.parents.map((id: number): number => id),
                    marriages: createPerson.marriages.map((id: number): number => id),
                    children: []
                });
            }
        } catch (error) {
            Logger.error("Failed to store new person", {}, error);
            enqueueSnackbar("Failed to store new person.", {
                variant: "error"
            });
        }
    }

    // const [mutate] = useMutation(UploadAvatarDocument);
    // const onAvatarImageFileSelect = async (event) => {
    //     const {
    //         target: {
    //             validity,
    //             files: [file],
    //         } } = event;
    //     const result = await mutate({ variables: { file, userId: createPerson.id.toString() } });
    //     setCreatePerson({ ...createPerson, avatar: result.data.uploadAvatar.filename });
    // }

    const handleCancel = () => {
        history.goBack();
    }

    const switchPrifileBio = (event, profileOrBio: EnumShowInfo) => {
        setShowProfileOrBio(profileOrBio)
    }

    const handleDelete = async () => {
        await mutateDeletePerson.mutateAsync({
            id: createPerson.id
        });
        history.goBack();
    }

    const handleDateOfBirthChange = (date: Date | null) => {
        setCreatePerson({ ...createPerson, birthdate: date });
    };

    const handleDateOfDeathChange = (date: Date | null) => {
        setCreatePerson({ ...createPerson, dayOfDeath: date });
    };

    let userMap = new Map<number, IUserMapItem>();
    let peopleOptionList = [];
    if (!allPersons.isLoading && allPersons.data) {
        allPersons.data.forEach((person: IPersonAPIEntry) => {
            let year = "";
            if (person.birthdate) {
                year = `(*${(new Date(person.birthdate)).getFullYear().toString()})`;
            }
            peopleOptionList.push(<MenuItem key={`item_key_${person.id}`} value={person.id.toString()}>{`(${person.id}) ${person.forename} ${person.lastname} ${year}`}</MenuItem>);
            userMap.set(person.id, {
                id: person.id,
                forename: person.forename,
                lastname: person.lastname,
                birthday: person.birthdate
            })
        });
    }

    // if (createPerson.avatar) {
    //     console.log(`${Config.SERVER_IMAGE_AVATAR}/${createPerson.avatar}`);
    // }
    return (
        <Container maxWidth="md" className={classes.container}>
            <Paper square>
                <Tabs variant="fullWidth" className={classes.tab}
                    value={showProfileOrBio}
                    onChange={switchPrifileBio}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab value={EnumShowInfo.PROFILE} label="Profile" />
                    <Tab value={EnumShowInfo.BIOGRAPHY} label="Biography" />
                    <Tab value={EnumShowInfo.IMAGES} label="Images" />
                </Tabs>
            </Paper>
            <Card >
                <CardContent>
                    {showProfileOrBio === EnumShowInfo.BIOGRAPHY &&
                        (
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <div>
                                        <TextField
                                            id="filled-multiline-static"
                                            label=""
                                            multiline
                                            onChange={changeBioContent}
                                            // rows={20}
                                            defaultValue={
                                                "# Biography\n## Birth"
                                            }
                                            value={createPerson.bio}
                                            variant="standard"
                                            fullWidth
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={6}>

                                    <div id="preview">
                                        {
                                            unified()
                                                .use(parse)
                                                .use(remark2react)
                                                .processSync(createPerson.bio).result
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        )
                    }
                    {showProfileOrBio === EnumShowInfo.IMAGES &&
                        (<div role="tabpanel" ><h1>TODO...</h1></div>)
                    }
                    {showProfileOrBio === EnumShowInfo.PROFILE &&
                        (
                            <div>
                                <div style={{ justifyContent: "center", display: "flex" }}>
                                    <Avatar
                                        src={
                                            createPerson.avatar
                                                ? `${Config.SERVER_IMAGE_AVATAR}/${createPerson.avatar}`
                                                : "avatar_placeholder.png"
                                        }
                                        className={classes.avatar}
                                    />
                                </div>
                                <div style={{ justifyContent: "center", display: "flex" }}>
                                    <input
                                        accept="image/jpeg, image/png"
                                        className={classes.inputFile}
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        type="file"
                                        disabled={createPerson.id == null}
                                    // onChange={onAvatarImageFileSelect}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button variant="contained" disabled={createPerson.id == null} component="span" className={classes.inputButton}>
                                            Change
                                        </Button>
                                    </label>
                                </div>

                                <form className={classes.inputstyle}>
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
                                                setCreatePerson({ ...createPerson, birthname: event.target.value });
                                            }}
                                            value={createPerson.birthname}
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
                            </div>
                        )
                    }
                </CardContent>
                <CardActions>
                    {
                        createPerson.id != null
                            ? <Button size="small" variant="outlined" onClick={() => { handleDelete(); }} color="secondary">Delete</Button>
                            : null
                    }
                    <Button size="small" onClick={() => { handleCancel(); }} color="secondary">
                        Cancel
                    </Button>
                    <Button size="small" onClick={() => { handleCreate(); }} color="primary">
                        {
                            createPerson.id
                                ? "Update"
                                : "Create"
                        }
                    </Button>
                </CardActions>
            </Card>
        </Container >
    );
}
