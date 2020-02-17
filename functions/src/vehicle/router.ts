import { Application } from "express";
import * as fc from "./controller";
import * as akses from "../auth/auth";

export function routesVehicle(app: Application) {
    app.get('/:key/vehicle/list',
        fc.vehicleall
    );
    app.get('/:key/images/thumbnail/:country/:locimg', 
        akses.isAdmin,
        fc.getthumbnail
    );
    app.get('/:key/vehicle/detail/:country/:id',
        fc.vehicledetail
    )
}

