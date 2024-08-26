import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { sequelize } from '@/lib/dbConnect';

// Define the type for model attributes
interface UserMoviesAttributes {
    id?: number;
    userId?: number;
    image?: string;
    title?: string;
    publishingYear?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the type for model creation
interface UserMoviesCreationAttributes extends Optional<UserMoviesAttributes, 'createdAt' | 'updatedAt'> {}

// Create a UserMovies model extending Sequelize.Model
class UserMovies extends Model<UserMoviesAttributes, UserMoviesCreationAttributes> implements UserMoviesAttributes {
    public id!: number;
    public userId?: number;
    public image?: string;
    public title?: string;
    public publishingYear?: number;
    public createdAt?: Date;
    public updatedAt?: Date;
}

// Initialize the UserMovies model with Sequelize
UserMovies.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    publishingYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'UserMovies',
    timestamps: true,
});

export default UserMovies;
