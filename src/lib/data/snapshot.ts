import "server-only";
import { cache } from "react";
import { getRepo } from "./index";

/** Una sola lectura de datos por petición, compartida por el layout y la página. */
export const getSnapshot = cache(() => getRepo().snapshot());
