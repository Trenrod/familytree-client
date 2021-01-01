import { DataTypes, Model, ModelAttributes } from 'sequelize';
import { Person, PersonWithId } from '../restapi/Api';

export class PersonDB extends Model<Person, PersonWithId> implements PersonWithId {
    public id?: number;
    public forename?: string;
    public lastname?: string;
    public birthname?: string;
    public birthdate?: string;
    public dayOfDeath?: string;
    public placeOfDeath?: string;
    public placeOfBirth?: string;
    public fatherId?: number;
    public motherId?: number;
    public avatar?: boolean;

    // public readonly createdAt!: Date;
    // public readonly updatedAt!: Date;
    public static MODEL_NAME = "Person";

    public static tableInit(): ModelAttributes<PersonDB> {
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
        };
    }
}
