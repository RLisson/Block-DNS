import { Router } from "express";
import DomainController from "../controllers/domainController";
import { Domain } from "domain";
const router = Router();

router.get("/", DomainController.getAllDomains);

router.get("/:id", DomainController.getDomainById);

router.get("/url/:url", DomainController.getDomainByUrl);

router.post("/", DomainController.createDomain);

router.put("/:id", DomainController.updateDomain);

router.put("/", DomainController.updateByUrl);

router.delete("/:id", DomainController.deleteDomain);

export default router;
