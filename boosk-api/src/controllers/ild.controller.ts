import { Request, Response } from "express";
import { AppDataSource } from "../data-source"
import { Ild } from "../models/ild";

exports.getAll = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Ild);

    const allILD = await repository.createQueryBuilder("ild").orderBy("ild.id", "ASC").getMany()

    res.status(200).json(allILD);
}


/**
 *  Renvois un élément précis à partir de son identifiant fourni dans la requête 
 *  Retourne une erreur appropriée si l'identifiant n'est pas fourni ou si l'élément correspondant n'est pas trouvé dans la base de données
 */
exports.getById = async (req: Request, res: Response) => {
    if (req.query.id) {
        const id = req.query.id;
        const repository = AppDataSource.getRepository(Ild);

        const cable = await repository.findOneBy({
            id: +id,
        });
        
        if(cable) {
            res.status(200).json(cable)
        }else {
            res.status(404).send(`ild ${id} not found`);
        }
    } else {
        res.status(401).send("id must be precised in query");
    }
}

/**
 * La fonction "exports.setOk" permet de mettre à jour le champ "ok" d'un élément dans la base de données
 * avec un identifiant spécifié dans la requête. 
 * Si les paramètres "id" et "value" sont fournis dans la requête, 
 * la fonction utilise le service de base de données pour trouver l'élément correspondant avec l'identifiant. 
 * Si l'élément est trouvé, le champ "ok" est mis à jour avec la valeur spécifiée
 *  et la réponse renvoie un code de statut 200 (OK) avec un message de confirmation. 
 * Sinon, la réponse renvoie un code de statut 404 (Non trouvé) avec un message d'erreur 
 * indiquant que l'élément n'a pas été trouvé ou un code de statut 401 (Non autorisé) 
 * avec un message d'erreur indiquant que les paramètres "id" et "value" doivent être précisés dans la requête.
 */
exports.setOk = async (req: Request, res: Response) => {
    if(req.query.id && req.query.value) { 
        const id = req.query.id;
        const value = req.query.value;
        const repository = AppDataSource.getRepository(Ild);

        const ildToUpdate = await repository.findOneBy({
            id: +id,
        })

        if (ildToUpdate) {
            ildToUpdate.ok = value === "true";
            await repository.save(ildToUpdate);
            res.status(200).json({
                "message":`ILD ${id} state updated to ${value}`,
                "status": 200
            });
        } else {
            res.status(404).send(`ild ${id} not found`);
        }
    } else {
        res.status(401).send("ILD id and value must be precised in query");
    }
}


/**
 * Cette fonction prend en paramètre une requête et une réponse. 
 * Si la requête contient un id, elle récupère l'objet correspondant dans la base de données, 
 * modifie sa propriété "ok" à false, et modifie la propriété "ok" à true pour tous les autres objets dans la base de données. 
 * Si l'objet correspondant est une source, la fonction renvoie une erreur avec un message approprié. 
 * Si la modification est réussie, la fonction renvoie la liste de tous les objets modifiés triés par id. 
 * Si la requête ne contient pas d'id, la fonction renvoie une erreur avec un message approprié.
 */
exports.setOneKOAndOthersOK = async (req: Request, res: Response) => {
    if(req.query.id) { 
        const id = req.query.id;
        const repository = AppDataSource.getRepository(Ild);

        const ilds = await repository.find();

        if (ilds) {
            let isError = false;
            let message = "";
            ilds.forEach(ild => {
                if(ild.id === +id) {
                    if(!ild.isSource){
                        if(ild.ok) {
                            ild.ok = false;
                        }
                    } else {
                        isError = true;
                        message = "ILD Source ne doit pas etre modifié"
                    }
                } else {
                    if(!ild.ok) {
                        ild.ok = true;
                    }
                } 
            });
            if(isError) {
                res.status(401).send(message);
            } else {
                await repository.save(ilds);
                ilds.sort((a,b) => {
                    return a.id - b.id;
                });
                res.status(200).json(ilds);
            }
        } else {
            res.status(404).send(`ilds not found`);
        }
    } else {
        res.status(401).send("ILD id and value must be precised in query");
    }
}