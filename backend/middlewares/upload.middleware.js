import path from 'path';
import multer from 'multer';

//Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // Les fichiers seront stockes dans le dossier upload    
    },
    filename: (req, file, cb) => {
        //Creation d'un nom de fichier unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E2) // variable unique pour le nom du fichier
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

//Filtre pour les types de fichiers
const fileFilter = (req, file, cb) => {
    // Accepter uniquement les images et les videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true)
    } else {
        cb(new Error('Seuls les images et les videos sont acceptés'))
    }
}

//Config Multer 
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024} // Limite de 10Mo
})

export default upload