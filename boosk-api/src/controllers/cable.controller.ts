import { Request, Response } from "express";
import { AppDataSource } from "../data-source"
import { Cable } from "../models/cable"


/**
 * Récupère tous les câbles de la base de données avec toutes leurs relations 
 * Renvoie un objet JSON contenant tous les câbles.
 */
exports.getAllCables = async (req: Request, res: Response) => {
    const cableRepository = AppDataSource.getRepository(Cable);

    const allCables = await cableRepository.find({
        relations: {
            relations : true
        }
    });

    res.status(200).json(allCables);
}


/**
 * Récupère un câble par son identifiant
 * Renvoie un objet JSON contenant les informations de ce câble.
 */
exports.getCableById = async (req: Request, res: Response) => {
    if (req.query.cableId) {
        const cableId = req.query.cableId;
        const cableRepository = AppDataSource.getRepository(Cable);

        const cable = await cableRepository.findOneBy({
            id: +cableId,
        })
        
        if(cable) {
            res.status(200).json(cable)
        }else {
            res.status(404).send(`cable ${cableId} not found`);
        }
    } else {
        res.status(401).send("cable id must be precised in query");
    }
}

/**
 * Met à jour l'état d'un câble dans la base de données en fonction des paramètres donnés
 * Renvoie une réponse HTTP 200 si la mise à jour est effectuée avec succès.
 */
exports.setOk = async (req: Request, res: Response) => {
    if(req.query.id && req.query.value) {
        const id = req.body.id;
        const value = req.body.value;
        const repository = AppDataSource.getRepository(Cable);

        const cableToUpdate = await repository.findOneBy({
            id: +id,
        })

        if (cableToUpdate) {
            cableToUpdate.ok = value === "true";
            await repository.save(cableToUpdate);
            res.status(200).send(`cable ${id} state updated to ${value}`);
        } else {
            res.status(404).send(`cable ${id} not found`);
        }
    } else {
        res.status(401).send("Cable id and value must be precised in body");
    }
}