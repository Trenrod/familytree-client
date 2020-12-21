import { ModelCtor, Sequelize } from 'sequelize';
import { Person, PersonAttributes } from '../dbmodels/Person';
import { ConfigManager, CONFIG_NAMES } from './Configuration';
import Logger from './Logger';

const log = Logger.getInstance();
const config = ConfigManager.getInstance();

export default class PersistanceManager {
    private static instance: PersistanceManager | null = null;
    private constructur() { }

    public personDB: ModelCtor<Person> | null = null;


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

        this.personDB = sequelize.define(Person.MODEL_NAME, Person.tableInit());
        this.personDB.belongsToMany(this.personDB, { as: "spouse", through: 'Married_Person' });

        await sequelize.sync({ alter: true, force: true });

    }

    public async readAllPersons(): Promise<Person[]> {
        const data = await this.personDB!.findAll();
        return data;
    }

    public async createPerson(person: PersonAttributes): Promise<Person | null> {
        try {
            const newPerson = this.personDB!.build(person)
            return await newPerson.save();
        } catch (error) {
            log.error("Faild to create person entry", error);
        }
        return null;
    }

    public async readPerson(personId: number): Promise<Person | null> {
        return await this.personDB!.findByPk(personId);
    }

    public async updatePerson(person: PersonAttributes): Promise<Person | null> {
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
}
