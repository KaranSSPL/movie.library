import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@/lib/dbConnect';

// Define the type for model attributes
interface UserAttributes {
    id: number;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the type for model creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Create a User model extending Sequelize.Model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Initialize the User model with Sequelize
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Users',
    timestamps: true,
});

export default User;
