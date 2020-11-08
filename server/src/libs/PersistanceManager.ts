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

    public async createPerson(person: PersonAttributes): Promise<Person> {
        const newPerson = this.personDB!.build(person)
        return await newPerson.save();
    }

    public async readPerson(personId: number): Promise<Person | null> {
        return await this.personDB!.findByPk(personId);
    }

    public async updatePerson(person: PersonAttributes): Promise<Person | null> {
        const personToUpdate = await this.personDB!.findByPk(person.id);
        if (personToUpdate != null) {
            personToUpdate.forename = person.forename;
            personToUpdate.lastname = person.forename;
            personToUpdate.birthname = string | null;
            personToUpdate.birthdate = Date | null;
            personToUpdate.dayOfDeath = Date | null;
            personToUpdate.placeOfDeath = string | null;
            personToUpdate.placeOfBirth = string | null;
            personToUpdate.fatherId = number | null;
            personToUpdate.motherId = number | null;
            personToUpdate.avatar = boolean;
            personToUpdate.save();
        }
        return null;
    }

    public async deletePerson(personId: number): Promise<number> {
        return this.personDB!.destroy(personId);
    }
}
