import { Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model, ModelAttributes, Optional } from 'sequelize';
import { Marriage } from '../restapi/Api';
import { PersonDB } from "./PersonDB";

export class MarriageDB extends Model<Marriage, Marriage> implements Marriage {
    public personId1?: number;
    public personId2?: number;

    // public readonly createdAt!: Date;
    // public readonly updatedAt!: Date;

    public static MODEL_NAME = "Marriage";

    static isMarriageCreationAttributes(obj: any): obj is MarriageDB {
        return typeof obj.id === "number" && typeof obj.personId1 === "number" && typeof obj.personId2 === "number";
    }

    public static tableInit(): ModelAttributes<MarriageDB> {
        return {
            personId1: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            personId2: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            }
        }
    }
}
