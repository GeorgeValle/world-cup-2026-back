import dotenv from 'dotenv';
dotenv.config();

let TeamDAO;
let StadiumDAO;
let MatchDAO;
let UserDAO;
const persistence = process.env.PERSISTENCE || 'MONGO';

switch (persistence) {
    case 'MONGO':
        // Importación dinámica: solo cargamos estos archivos si usamos Mongo
        const { default: TeamMongoDAO } = await import('./mongo/TeamDAO.js');
        const { default: StadiumMongoDAO } = await import('./mongo/StadiumDAO.js');
        const { default: MatchMongoDAO } = await import('./mongo/MatchDAO.js');
        const { default: UserMongoDAO } = await import('./mongo/UserMongo.js');
        // Instanciamos la clase
        TeamDAO = new TeamMongoDAO();
        StadiumDAO = new StadiumMongoDAO();
        MatchDAO = new MatchMongoDAO();
        UserDAO = new UserMongoDAO();
        break;
        
    case 'MEMORY':
    case 'SQL':
        // Acá irían las lógicas para otras bases de datos el día de mañana
        break;
    default:
        throw new Error('Persistence method not supported');
}

export { TeamDAO, StadiumDAO, MatchDAO, UserDAO };