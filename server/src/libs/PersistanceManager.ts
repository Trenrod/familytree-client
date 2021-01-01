import { ModelCtor, Op, Sequelize } from 'sequelize';
import { MarriageDB } from '../dbmodels/MarriageDB';
import { PersonDB } from "../dbmodels/PersonDB";
import { Marriage, Person, PersonWithId } from '../restapi/Api';
import { ConfigManager, CONFIG_NAMES } from './Configuration';
import Logger from './Logger';

const log = Logger.getInstance();
const config = ConfigManager.getInstance();

export default class PersistanceManager {
    private static instance: PersistanceManager | null = null;
    private constructur() { }

    public personDB: ModelCtor<PersonDB> | null = null;
    public marriageDB: ModelCtor<MarriageDB> | null = null;


    public static getInstance() {
        if (PersistanceManager.instance == null) {
            PersistanceManager.instance = new PersistanceManager();
            PersistanceManager.instance.init()
        }
        return PersistanceManager.instance;
    }

    public async init() {
        const connectionString = `postgres://${config.getValue(CONFIG_NAMES.FT_DB_USER)}:${config.getValue(CONFIG_NAMES.FT_DB_PASSWORD)}@${config.getValue(CONFIG_NAMES.FT_DB_HOST)}:${config.getValue(CONFIG_NAMES.FT_DB_PORT)}/${config.getValue(CONFIG_NAMES.FT_DB_NAME)}`; // Example for postgres
        const sequelize = new Sequelize(connectionString);

        try {
            await sequelize.authenticate();
            log.info('Connection has been established successfully.');
        } catch (error) {
            log.error('Unable to connect to the database:', error);
            process.exit(1);
        }

        this.personDB = sequelize.define(PersonDB.MODEL_NAME, PersonDB.tableInit());
        this.marriageDB = sequelize.define(MarriageDB.MODEL_NAME, MarriageDB.tableInit());

        this.personDB.hasOne(this.marriageDB, {
            foreignKey: "personId1",
        });

        this.personDB.hasOne(this.marriageDB, {
            foreignKey: "personId2",
        });

        await sequelize.sync({ alter: true, force: true });

    }

    /** Persons START */

    public async readAllPersons(): Promise<PersonDB[]> {
        const data = await this.personDB!.findAll();
        return data;
    }

    public async createPerson(person: Person): Promise<PersonDB> {
        return await this.personDB!.create(person);
    }

    public async readPerson(personId: number): Promise<PersonDB | null> {
        return await this.personDB!.findByPk(personId);
    }

    public async updatePerson(person: PersonWithId): Promise<PersonDB | null> {
        const personToUpdate = await this.personDB!.findByPk(person.id);
        if (personToUpdate != null) {
            personToUpdate.forename = person.forename;
            personToUpdate.lastname = person.forename;
            personToUpdate.birthname = person.birthname;
            personToUpdate.birthdate = person.birthdate;
            personToUpdate.dayOfDeath = person.dayOfDeath;
            personToUpdate.placeOfDeath = person.placeOfDeath;
            personToUpdate.placeOfBirth = person.placeOfBirth;
            personToUpdate.fatherId = person.fatherId;
            personToUpdate.motherId = person.motherId;
            personToUpdate.avatar = person.avatar;
            return await personToUpdate.save();
        }
        return null;
    }

    public async deletePerson(personId: number): Promise<boolean> {
        const personToUpdate = await this.personDB!.findByPk(personId);
        if (personToUpdate != null) {
            await personToUpdate.destroy();
            return true;
        }
        return false;
    }

    /** Persons END */

    /** Meriage START */
    public async readAllMarriages(): Promise<MarriageDB[]> {
        const data = await this.marriageDB!.findAll();
        return data;
    }

    public async readMarriageByPersonId(personId: number) {
        const data = await this.marriageDB!.findAll({
            where: {
                [Op.or]: [
                    { personId1: personId },
                    { personId2: personId }
                ]
            }
        });
        return data;
    }

    public async createMarriage(marriage: Marriage): Promise<MarriageDB> {
        return this.marriageDB!.create(marriage);
    }

    public async readMarriage(marriageId: number): Promise<MarriageDB | null> {
        return await this.marriageDB!.findByPk(marriageId);
    }

    public async deleteMarriage(marriageId: number): Promise<boolean> {
        const marriageToUpdate = await this.marriageDB!.findByPk(marriageId);
        if (marriageToUpdate != null) {
            await marriageToUpdate.destroy();
            return true;
        }
        return false;
    }
    /** Meriage END */
}
