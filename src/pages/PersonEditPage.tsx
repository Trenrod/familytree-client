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
import { useMutation, useQuery } from '@apollo/client';
import { IPersonEntry } from '../models/IPersonEntry';
import { useSnackbar } from 'notistack';
import { Logger } from '../libs/Logger';
import {
    useHistory
} from "react-router-dom";
import { UploadAvatarDocument, InputMarriageId, InputUserId, UserFieldsFragment, CreateUserDocument, UpdateUserDocument, DeleteUserDocument, AllUsersDocument } from '../libs/generated/graphql';
import Config from '../libs/Config';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

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
    id: String,
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
    user: IPersonEntry | null
}

export default function PersonEditPage(props: ModifyPersonProps): ReactElement {
    const { enqueueSnackbar } = useSnackbar();

    const history = useHistory();
    const classes = useStyles();

    const [showProfileOrBio, setShowProfileOrBio] = useState<EnumShowInfo>(EnumShowInfo.PROFILE);

    const [createPerson, setCreatePerson] = React.useState<IPersonEntry>({
        id: props.user?.id,
        forename: props.user?.forename || "",
        lastname: props.user?.lastname || "",
        birthdate: props.user?.birthdate || null,
        birthName: props.user?.birthName || "",
        dayOfDeath: props.user?.dayOfDeath || null,
        bio: props.user?.bio || null,
        avatar: props.user?.avatar || null,
        parents: props.user?.parents ?? [],
        children: props.user?.children ?? [],
        marriages: props.user?.marriages ?? [],
        marriagesWithUsers: props.user?.marriagesWithUsers ?? [],
        placeOfBirth: props.user?.placeOfBirth ?? null,
        placeOfDeath: props.user?.placeOfDeath ?? null,
        gender: null,
        markers: null
    });


    const [createUserMutation, createUser] = useMutation(CreateUserDocument);
    const [updateUserMutation, updateUser] = useMutation(UpdateUserDocument);
    const [deleteUserMutation] = useMutation(DeleteUserDocument);

    const allUsers = useQuery(AllUsersDocument);

    useEffect(() => {
        if (createUser.error) {
            Logger.error("Failed to store/update", { error: createUser.error }, null)
            enqueueSnackbar(`Failed to create. ${createUser.error.toString()}`, {
                variant: "error"
            });
        } else if (updateUser.error) {
            Logger.error("Failed to store/update", { error: updateUser.error }, null)
            enqueueSnackbar(`Failed to update. ${updateUser.error.toString()}`, {
                variant: "error"
            });
        }
    }, [createUser.data, updateUser.data]);

    const changeBioContent = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCreatePerson({ ...createPerson, bio: event.target.value });
    }

    const handleCreate = async () => {
        try {
            if (createPerson.id) {
                await updateUserMutation({
                    variables: {
                        id: createPerson.id.toString(10),
                        bio: createPerson.bio,
                        forename: createPerson.forename,
                        lastname: createPerson.lastname,
                        birthname: createPerson.birthName,
                        birthdate: createPerson.birthdate,
                        dayOfDeath: createPerson.dayOfDeath,
                        children: createPerson.children.map((childId): InputUserId => { return { id: childId.toString() } }),
                        parents: createPerson.parents.map((parentId): InputUserId => { return { id: parentId.toString() } }),
                        marriages: createPerson.marriages.map((marriageId): InputMarriageId => { return { id: marriageId.toString() } }),
                        marriageWithUserId: createPerson.marriagesWithUsers.map((marriageId): InputMarriageId => { return { id: marriageId.toString() } }),
                    }
                });
                history.goBack();
            } else {
                await createUserMutation({
                    variables: {
                        forename: createPerson.forename,
                        lastname: createPerson.lastname,
                        birthname: createPerson.birthName,
                        birthdate: createPerson.birthdate,
                        bio: createPerson.bio,
                        dayOfDeath: createPerson.dayOfDeath,
                        children: createPerson.children.map((childId): InputUserId => { return { id: childId.toString() } }),
                        parents: createPerson.parents.map((parentId): InputUserId => { return { id: parentId.toString() } }),
                        marriages: createPerson.marriages.map((marriageId): InputMarriageId => { return { id: marriageId.toString() } }),
                        marriageWithUserId: createPerson.marriagesWithUsers.map((marriageId): InputMarriageId => { return { id: marriageId.toString() } }),
                    }
                });
            }
        } catch (error) {
            Logger.error("Failed to store new person", {}, error);
            enqueueSnackbar("Failed to store new person.", {
                variant: "error"
            });
        }
    }

    const [mutate] = useMutation(UploadAvatarDocument);
    const onAvatarImageFileSelect = async (event) => {
        const {
            target: {
                validity,
                files: [file],
            } } = event;
        const result = await mutate({ variables: { file, userId: createPerson.id.toString() } });
        setCreatePerson({ ...createPerson, avatar: result.data.uploadAvatar.filename });
    }

    const handleCancel = () => {
        history.goBack();
    }

    const switchPrifileBio = (event, profileOrBio: EnumShowInfo) => {
        setShowProfileOrBio(profileOrBio)
    }

    const handleDelete = async () => {
        await deleteUserMutation({
            variables: { id: createPerson.id.toString() }
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
    if (!allUsers.loading && allUsers.data) {
        allUsers.data.allUsers.forEach((value: UserFieldsFragment) => {
            let year = "";
            if (value.birthdate) {
                year = `(*${(new Date(value.birthdate)).getFullYear().toString()})`;
            }
            peopleOptionList.push(<MenuItem key={`item_key_${value.id}`} value={value.id.toString()}>{`(${value.id}) ${value.forename} ${value.lastname} ${year}`}</MenuItem>);
            userMap.set(parseInt(value.id), {
                id: value.id,
                forename: value.forename,
                lastname: value.lastname,
                birthday: value.birthdate
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
                                        onChange={onAvatarImageFileSelect}
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
                                                value={createPerson.marriagesWithUsers.map((id) => id.toString())}
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
                                                        ...createPerson, marriagesWithUsers: value
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
