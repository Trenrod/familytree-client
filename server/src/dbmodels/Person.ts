import { Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model, ModelAttributes, Optional } from 'sequelize';

export interface PersonAttributes {
    id: number;
    forename: string | null | undefined;
    lastname?: string | null;
    birthname?: string | null;
    birthdate?: Date | null;
    dayOfDeath?: Date | null;
    placeOfDeath?: string | null;
    placeOfBirth?: string | null;
    fatherId?: number | null;
    motherId?: number | null;
    avatar?: boolean;
}

// Some attributes are optional in `User.build` and `User.create` calls
export interface PersonCreationAttributes extends Optional<PersonAttributes, "id"> { }


export class Person extends Model<PersonAttributes, PersonCreationAttributes> implements PersonAttributes {
    public id!: number;
    public forename: string | null | undefined;
    public lastname: string | null | undefined;
    public birthname: string | null | undefined;
    public birthdate: Date | null | undefined;
    public dayOfDeath: Date | null | undefined;
    public placeOfDeath: string | null | undefined;
    public placeOfBirth: string | null | undefined;
    public fatherId: number | null | undefined;
    public motherId: number | null | undefined;
    public avatar: boolean | undefined;

    // public readonly createdAt!: Date;
    // public readonly updatedAt!: Date;

    public static MODEL_NAME = "Person";

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    public getSpouses!: HasManyGetAssociationsMixin<Person>; // Note the null assertions!
    public addSpouse!: HasManyAddAssociationMixin<Person, number>;
    public hasSpouse!: HasManyHasAssociationMixin<Person, number>;
    public countSpouses!: HasManyCountAssociationsMixin;
    public createSpouse!: HasManyCreateAssociationMixin<Person>;

    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.
    public readonly spouses?: Person[]; // Note this is optional since it's only populated when explicitly requested in code

    public static associations: {
        spouses: Association<Person, Person>;
    };

    static isPersonCreationAttributes(obj: any): obj is Person {
        return typeof obj.forename === "string" && typeof obj.lastname === "string";
    }

    public static tableInit(): ModelAttributes<Person> {
        return {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                autoIncrement: true,
                primaryKey: true
            },
            forename: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            birthname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            birthdate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            dayOfDeath: {
                type: DataTypes.DATE,
                allowNull: true
            },
            placeOfDeath: {
                type: DataTypes.STRING,
                allowNull: true
            },
            placeOfBirth: {
                type: DataTypes.STRING,
                allowNull: true
            },
            fatherId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            motherId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            avatar: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }
    }
}
