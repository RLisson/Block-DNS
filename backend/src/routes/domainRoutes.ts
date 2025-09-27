import { Router } from "express";
import DomainController from "../controllers/domainController";
import { requireAuth } from "../middlewares/auth";
const router = Router();

router.use(requireAuth);

router.get("/", DomainController.getAllDomains);

router.get("/search", DomainController.searchDomains);

router.get("/rpz", DomainController.generateRpz);

router.get("/scp-status", DomainController.getScpStatus);

router.get("/:id", DomainController.getDomainById);

router.get("/url/:url", DomainController.getDomainByUrl);

router.post("/", DomainController.createDomain);

router.put("/:id", DomainController.updateDomain);

router.put("/", DomainController.updateByUrl);

router.delete("/:id", DomainController.deleteDomain);


export default router;
