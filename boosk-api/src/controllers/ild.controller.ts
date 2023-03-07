import { Request, Response } from "express";
import { AppDataSource } from "../data-source"
import { Ild } from "../models/ild";

exports.getAll = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Ild);

    const allILD = await repository.createQueryBuilder("ild").orderBy("ild.id", "ASC").getMany()

    res.status(200).json(allILD);
}

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